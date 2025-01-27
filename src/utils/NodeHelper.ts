import { Edge } from "@xyflow/react"
import { AppNode } from "../nodes/types";
import dagre from '@dagrejs/dagre';

export const convertToNode = (data: []) => {
    // Generate nodes and edges
    const nodes: AppNode[] = [];
    const edges: Edge[] = [];

    data.forEach((step) => {
        // Add main step as a node
        nodes.push({ id: step.id, data: {label: step.label, description: step.description }});

        // Add substeps as nodes and connect them to the parent step
        step.substeps?.forEach((substep) => {
            nodes.push({ id: substep.id, data: {label: substep.label, description: substep.description }});
            edges.push({ id: [step.id, substep.id].join("->"), source: step.id, target: substep.id });
        });
    });

    // Connect main steps sequentially
    for (let i = 0; i < data.length - 1; i++) {
        edges.push({ id: [data[i].id, data[i+1].id].join("->"), source: data[i].id, target: data[i + 1].id });
    }

    // Log nodes and edges
    console.log("Nodes:", JSON.stringify(nodes, null, 2));
    console.log("Edges:", JSON.stringify(edges, null, 2));

    return [ nodes, edges ];
}

export const getLayoutedElements = (nodes, edges) => {
    const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
 
    const nodeWidth = 172;
    const nodeHeight = 36;
    const direction = 'TB';
    dagreGraph.setGraph({ rankdir: direction });
    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const newNode = {
            ...node,
            targetPosition: 'top',
            sourcePosition: 'bottom',
            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        };
        return newNode;
    });
    return [ newNodes, edges ];
};