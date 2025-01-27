import type { Node, BuiltInNode } from '@xyflow/react';

// We define the types of our nodes used in the App in AppNode.
// PositionLoggerNode and BuiltInNode are not included as they do not have a description.
export type PositionLoggerNode = Node<{ label: string }, 'position-logger'>;
export type StepNode = Node<{ label: string, description: string }, 'step'>;
export type ExampleNode = Node<{ label: string, description: string }, 'example'>;
export type AppNode = StepNode | ExampleNode;

