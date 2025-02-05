import pandas as pd
import numpy as np
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from neo4j import GraphDatabase
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from pathlib import Path
import re

pd.options.display.max_rows=4000
pd.options.display.max_columns=4000
pd.set_option("max_colwidth",4000)

chat = None
driver = None

data_path = Path('data/')
cyber_attack = ['phishing']
IR_phases = ['identification', 'containment', 'recovery', 'remediation', 'preparation']

import queue
import threading
import time 

app = Flask(__name__)
CORS(app)
# Global log queue for storing logs
log_queue = queue.Queue()

def log_message(*args):
    """Log message to both console and queue."""
    # print(message)  # Still prints to the backend console
    message = " ".join(map(str, args))
    print("in log message")
    print(message)
    log_queue.put(message)  # Add log to queue for streaming

def start_up():
    global chat
    # Do Not Push API Key
    # Example LLM interaction
    chat = ChatOpenAI(model="gpt-4o-mini",api_key = api, temperature=0.2, top_p=0.1)
    response = chat.predict("What is the capital of Germany?")
    # print("Test response:")
    # print(response)

    global driver
    # connect to neo4j using python
    URI = 'bolt://localhost:7687'
    AUTH = ('neo4j',"P@ssw0rd")
    with GraphDatabase.driver(URI, auth=AUTH) as driver:
        driver.verify_connectivity()
        print("connection established")
        log_message("Connection to database established...")


def find_key_steps_for_phase(cyber_attack, IR_phase):
    # print("inside find_key_steps_for_phase()")
    cyber_attack = cyber_attack.upper()
    #IR_phase = IR_phase.upper()
    IR_phase_steps_info=pd.DataFrame(columns = ['attack_node_id','workflow_source','IRPhase_node_id','IRPhase_node_desc','IRPhaseStep_node_id','IRPhaseStep_node_desc']) 
    #Find all nodes for the particular cyber_attack 
    attack_nodes, summary, keys = driver.execute_query("match (k:TTP_Type WHERE toUpper(k.name) = '"+cyber_attack+"') return ID(k) as node_id, k['source'] as node_source", database_="neo4j")
    # For each attack_node, find all its neighbors of the type IR_phase. For each of the nodes of type IR_phase, find its immediate neighbors, 
    # and store their description and node id. 
    print("attack_nodes = ",attack_nodes)
    message = ("attack_nodes = ",attack_nodes)
    log_message(message)
    for atk_node in attack_nodes:
        phase_nodes, summary, keys = driver.execute_query("match (k:TTP_Type)-->(p:"+IR_phase+") WHERE ID(k) = "+str(atk_node['node_id'])+" return ID(p) as nbr_id,p.ATTACK_TTP as nbr_ttp,p.objective as nbr_obj", database_="neo4j")
        for phase_node in phase_nodes:
            tmp_dict1 = {'attack_node_id':atk_node['node_id'],'workflow_source':atk_node['node_source'],'IRPhase_node_id':phase_node['nbr_id'],'IRPhase_node_desc':phase_node['nbr_obj']if phase_node['nbr_ttp']=='none' else phase_node['nbr_obj']+phase_node['nbr_ttp']}
            step_nodes, summary, keys = driver.execute_query("match (k:"+IR_phase+")-->(p) WHERE ID(k) = "+str(phase_node['nbr_id'])+" return ID(p) as nbr_id,p.description as nbr_desc", database_="neo4j")
            for step_node in step_nodes:
                tmp_dict2 = {'IRPhaseStep_node_id':step_node['nbr_id'],'IRPhaseStep_node_desc':step_node['nbr_desc']}
                tmp_row = tmp_dict1|tmp_dict2
                IR_phase_steps_info = pd.concat([IR_phase_steps_info,pd.DataFrame([tmp_row])], ignore_index=True)
    return(IR_phase_steps_info)

# For each of the nodes denoting steps in IR Phase (IRPhaseStep_node_id), determing all it's neighbours and generate a knowledge graph from it. 
def get_details_IR_step(IR_phase_steps_info):
    # print("inside get_details_IR_step()")
    step_info=[]
    step_methods = []
    # Identify all step nodes in the dataframe
    for i in IR_phase_steps_info.index:
        node_id = IR_phase_steps_info['IRPhaseStep_node_id'][i]
        num_methods = 0
        #Find all neighbors of the node
        ex=''
        method_nodes, summary, keys = driver.execute_query("match (k WHERE ID(k) = "+str(node_id)+") --> (p) return p['description'] as method", database_="neo4j")
        for node in method_nodes:
            ex += " "+ node['method']
            num_methods +=1
        ex = '. Some methods are : '+ex if ex!='' else ''    
        tmp = IR_phase_steps_info['IRPhaseStep_node_desc'][np.where(IR_phase_steps_info['IRPhaseStep_node_id']==node_id)[0]][i]
        print("i = ",i,tmp)
        log_message("i = ",i,tmp)
        step_info.append(tmp+ ex)
        step_methods.append(num_methods)
    IR_phase_steps_info['step_kg'] = step_info
    IR_phase_steps_info['num_methods'] = step_methods
    return IR_phase_steps_info

def compress_IR_step(IR_phase_steps_info):
    res_compressed = IR_phase_steps_info.iloc[np.where(IR_phase_steps_info.num_methods >= 3)[0],]
    tmp = IR_phase_steps_info.iloc[np.where(IR_phase_steps_info.num_methods < 3)[0],]
    new_kg = ','.join(tmp.step_kg)
    new_row = pd.DataFrame({'attack_node_id':0,'workflow_source':'na','IRPhase_node_id':0,'IRPhase_node_desc':'na','IRPhaseStep_node_id':0,'IRPhaseStep_node_desc':'compressed node','step_kg':new_kg,'num_methods':0},[0])
    res_compressed = pd.concat([res_compressed,new_row], ignore_index=True)
    return(res_compressed)

# Assumes that input step_info is a dictionary containing the following keys : IRPhaseStep_node_id, IRPhaseStep_node_desc, step_kg
def gen_workflow_for_step(step_info,IR_phase,cyber_attack, llm_chat):
    # print("inside gen_workflow_for_step()")
    stage = step_info['IRPhaseStep_node_desc']
    messages  = [
                    SystemMessage(content="""You are an excellent cyber security analyst and you can recommend incident handling workflows.
                    #STYLE#
                    Incident handling expert
                    #TONE#
                    Professional, Technical"""),
                    AIMessage(content="You have the following knowledge in the following knowledge graph:\n\n" +  '###'+ step_info['step_kg'] + 'Use the entire knowledge graph to generate your answer and do not ignore any information contained in it.\n\n'),
                    HumanMessage(content="User input:"+ 'The '+IR_phase+" of incident handling for a "+cyber_attack+" attack consists of multiple stages. One of those stages is "+stage+". Provide detailed stepwise process to complete this stage. Think step by step.\n\n\n"
                                 +"You have the following knowledge in the following knowledge graph:\n\n" +  '###'+ step_info['step_kg'] + 'Use the entire knowledge graph to generate your answer and do not ignore any information contained in it.Only answer in the context of the knowledge graph provided to you and do not generate output from your internal knowledge. Keep the output of similar length as the knowledge graph.\n\n'
                                + "Output1: The answer includes step by step process.\n\n"
                                 +"Output2: Show me inference process as a string about extract what knowledge from which neighbor graph. If you did not use some knowledge graph, provide your rational for not using the knowledge graph\n\n"
                                 )
    
    ]
    new_result = llm_chat.invoke(messages)
    return(new_result.content)

def gen_workflows_IR_phase(steps_info,IR_phase,cyber_attack, llm_chat):
    print("inside gen_workflows_IR_phase()")
    summary = "The "+IR_phase+" stage of incident handling for "+cyber_attack+" consists of the following steps : "
    workflow = ''
    for i in range(0,len(steps_info)):
        # print("i = ",i)
        # log_message("i = ",i)
        # Generate workflow for the step 
        x = steps_info[i]
        # print(x)
        # log_message(x)
        res = gen_workflow_for_step(x,IR_phase,cyber_attack, llm_chat)
        summary = summary + ', '+x['IRPhaseStep_node_desc']
        title = '\n\n Step = '+x['IRPhaseStep_node_desc']+'\n\n'
        # print("title = ",title)
        # log_message("title = ",title)
        res = title + res
        # print("length of result = ",len(res))
        workflow += res
        # print("length of workflow = ",len(workflow))
    workflow += summary
    f = open(IR_phase+'.txt',"w")
    f.write(workflow)
    f.close()
    return(workflow)

app = Flask(__name__)

CORS(app)

@app.route('/')
def test():
    return "Backend is up"

@app.route('/api/llm-call', methods=['GET'])
def call_LLM():
    log_message("Generating workflow...")
    for IR_phase in IR_phases:
        info = find_key_steps_for_phase(cyber_attack[0], IR_phase)
        info_steps = get_details_IR_step(info)
        c_steps = compress_IR_step(info_steps)
        info_steps_dict = c_steps.to_dict(orient='records')
        wf = gen_workflows_IR_phase(info_steps_dict, IR_phase, cyber_attack[0], chat)
    print("generated wf = ", wf)
    generatedWorkflow = "Generated workflow : "+ wf
    log_message(generatedWorkflow)
    return jsonify(wf), 200

@app.route('/api/demo/llm-call', methods=['GET'])
def call_LLM_demo():
    call_LLM() # generate text for IR phases
    user_query = request.args   
    attack_query = user_query.get("attackType", "")
    phase_query = user_query.get("incidentHandlingPhase", "")
    attack = None
    phase = None

    attack_match = next((attack_type for attack_type in cyber_attack if attack_type in attack_query), None)
    if attack_match:
        attack = attack_match
    else:
        return jsonify({"error": "Attack type is not valid"}), 400
    
    phase_match = next((phase_type for phase_type in IR_phases if phase_type in phase_query), None)
    if phase_match:
        phase = phase_match
    else:
        return jsonify({"error": "Incident Handling Phase is not valid"}), 400
    
    fileName = data_path / attack / (phase + '.txt')
    print(fileName)
    if not (fileName.exists()):
        return jsonify({"error": "File not found"}), 404
    
    with open(fileName, 'r') as file:
        content = file.read()
    def parse_text_to_nodes(text):
        mainnodes = []
        current_step = None
        current_substeps = []

        for line in text.splitlines():
            line = line.strip()
            if not line:
                continue
            if re.match(r"^Step \d+: ", line):
                match = re.search(r"^Step (\d+):", line)
                id = match.group(1)
                matchHeader = re.search(r'^(.*?:.*?)(?::(.*))?$', line)
                label = matchHeader.group(1).strip() if matchHeader else ""
                description = matchHeader.group(2).strip() if matchHeader.group(2) else ""
                if current_step:
                    mainnodes.append(current_step)
                current_step = {'label': label,'id':id,'description':description, 'substeps':[]}
                current_substeps = current_step['substeps']
            elif re.match(r"^\d+\.\w+ ", line):
                substep_match = re.match(r"^(\d+\.\w+) (.+): (.+)", line)
                if substep_match:
                    substep_id, label, description = substep_match.groups()
                    formatted_id = "".join(substep_id.split("."))
                    current_substeps.append({
                        'id':formatted_id,
                        'label':label,
                        'description':description
                    })
            elif line.startswith("-"):
                if current_substeps:
                    current_substeps[-1].setdefault("details", []).append(line.strip("- ").strip())
        if current_step:
            mainnodes.append(current_step)
        return mainnodes
    main_nodes = parse_text_to_nodes(content)
        
    log_message("Identification generation complete!")  #
    return jsonify(main_nodes), 200



import json

@app.route('/api/demo/llm-call-query', methods=['GET'])
def call_LLM_demo_query():
    user_query = request.args.get("query", "")
    
    if not user_query:
        return jsonify({"error": "Query is required"}), 400

    llm_response = process_query(user_query)

    # Extract attackType and incidentHandlingStep from the LLM response
    try:
        response_json = json.loads(llm_response)  # Ensure the LLM response is valid JSON
        attack_type = response_json.get("attackType", "")
        incident_handling_step = response_json.get("incidentHandlingStep", "")
    except Exception as e:
        return jsonify({"error": "Failed to parse LLM response", "details": str(e)}), 500

    # Return the extracted fields as JSON
    return jsonify({
        "attackType": attack_type,
        "incidentHandlingStep": incident_handling_step
    }), 200

@app.route('/api/logs', methods=['GET'])
def stream_logs():
    """Stream logs from the queue to the frontend in real-time."""
    def generate():
        while True:
            try:
                log = log_queue.get(timeout=10)  # Get log with timeout
                yield f"data: {log}\n\n"  # Send log as SSE
            except queue.Empty:
                yield "data: [heartbeat]\n\n"  # Keep connection alive
    return Response(generate(), mimetype="text/event-stream")


def process_query(user_query):

    """
    Chatbot function that processes a user query and interacts with an LLM
    to generate a response in JSON format.
    """
    # Define the system instruction for the LLM
    system_message = """
    Extract the attack type and incident handling step from the following query.
    The response must be in valid JSON format, including only the fields 
    `attackType` and `incidentHandlingStep`. 'phishing' is the only form of attack type.
    There should only be "identification", "recovery", "remediation", "preparation" and "containment" as incident handling steps, if not pick the closest one of out of the three.
    Do not include any additional text or explanation before or after the JSON response.
    """
    #note refine system message 

    # Concatenate the system message and user query
    full_message = f"{system_message}\nQuery: {user_query}"

    # Generate the response
    response_message = chat.predict(full_message)

    return response_message


if __name__ == '__main__':
    start_up()
    app.run(debug=True, port=5005)






# # set up the LLM 
# from dotenv import load_dotenv
# import os
# from google.auth.transport.requests import Request
# from google.oauth2.service_account import Credentials
# import vertexai
# from langchain_google_vertexai import ChatVertexAI


# # Load environment variables from .env file
# load_dotenv()

# # Get environment variables
# google_credentials = {
#     "type": "service_account",
#     "project_id": os.getenv("GOOGLE_PROJECT_ID"),
#     "private_key_id": os.getenv("GOOGLE_PRIVATE_KEY_ID"),
#     "private_key": os.getenv("GOOGLE_PRIVATE_KEY").replace("\\n", "\n"),  # Ensure proper formatting for private key
#     "client_email": os.getenv("GOOGLE_CLIENT_EMAIL"),
#     "client_id": os.getenv("GOOGLE_CLIENT_ID"),
#     "auth_uri": os.getenv("GOOGLE_AUTH_URI"),
#     "token_uri": os.getenv("GOOGLE_TOKEN_URI"),
#     "auth_provider_x509_cert_url": os.getenv("GOOGLE_AUTH_PROVIDER_CERT_URL"),
#     "client_x509_cert_url": os.getenv("GOOGLE_CLIENT_CERT_URL"),
# }

# # Create credentials from the dictionary
# credentials = Credentials.from_service_account_info(
#     google_credentials,
#     scopes=["https://www.googleapis.com/auth/cloud-platform"]
# )

# # Initialize Vertex AI with the credentials
# vertexai.init(
#     project=os.getenv("GOOGLE_PROJECT_ID"),
#     location=os.getenv("REGION"),
#     credentials=credentials
# )
# chat = ChatVertexAI(model="gemini-1.5-flash", credentials=credentials)
