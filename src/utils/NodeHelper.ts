import { Edge, Position } from "@xyflow/react"
import { AppNode } from "../nodes/types";
import dagre from '@dagrejs/dagre';
import { ExampleNode } from "../nodes/ExampleNode";

export const convertToNode = (data: []) => {
    interface SubnodesDict {
        [key: string]: AppNode[];
    }
    // Generate nodes and edges
    const nodes: AppNode[] = [];
    const subnodesDict: SubnodesDict = {};
    const edges: Edge[] = [];
    const sequentialEdges: Edge[] = [];

    data.forEach((step) => {
        // Add main step as a node
        nodes.push({ id: step.id, type:'step', data: {label: step.label, description: step.details ? step.description + step.details : step.description }});

        // Add substeps as nodes and connect them to the parent step
        step.substeps?.forEach((substep) => {
            const subnode = ({ id: substep.id, type:'example', data: {label: substep.label, description: substep.details ? substep.description + substep.details : substep.description }});
            if (!subnodesDict[step.id]) {
                subnodesDict[step.id] = [];
            }
            subnodesDict[step.id].push(subnode);
            edges.push({ id: [step.id, substep.id].join("->"), source: step.id, target: substep.id });
        });
    });

    // Connect main steps sequentially
    for (let i = 0; i < data.length - 1; i++) {
        sequentialEdges.push({ id: [data[i].id, data[i+1].id].join("->"), source: data[i].id, target: data[i + 1].id });
    }

    return [ nodes, edges, subnodesDict, sequentialEdges ];
}

export const getLayoutedElements = (nodes, edges, subnodesDict, sequentialEdges) => {
    const nodeWidth = 130;
    const nodeHeight = 60;
    const direction = 'TB';
    const XOffset = 0;
    var YOffset = 0;
    const YChange = 150;
    const newSubnodesDict = {};
    nodes.forEach((node) => {
        const dagreSubGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
        dagreSubGraph.setGraph({ rankdir: direction });
        subnodesDict[node.id]?.forEach((subnode) => {
            dagreSubGraph.setNode(subnode.id, { width: nodeWidth, height: nodeHeight });
        })
        dagre.layout(dagreSubGraph)
        node.position = {x: XOffset, y: YOffset};
        var highestX = 0;
        var lowestX = 0;
        dagreSubGraph.nodes()?.forEach((subnodeId) => {
            const x = dagreSubGraph.node(subnodeId).x;
            if (x > highestX) {
                highestX = x;
            }
            if (x < lowestX) {
                lowestX = x;
            }
        });
        const rowLength = highestX - lowestX;
        newSubnodesDict[node.id] = subnodesDict[node.id]?.map((subnode) => {
            const newSubnode = {
                ...subnode,
                position: {
                    x: dagreSubGraph.node(subnode.id).x + XOffset - Math.floor(rowLength / 2),
                    y: dagreSubGraph.node(subnode.id).y + YOffset + YChange/4 ,
                }
            }
            return newSubnode;
        })
        YOffset += YChange;
    });

    return [ nodes, edges, newSubnodesDict, sequentialEdges];
};