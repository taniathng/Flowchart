import { Handle, Position, type NodeProps } from '@xyflow/react';

import { type ExampleNode } from './types';

export function ExampleNode({
positionAbsoluteX,
positionAbsoluteY,
data,
}: NodeProps<ExampleNode>) {
const x = `${Math.round(positionAbsoluteX)}px`;
const y = `${Math.round(positionAbsoluteY)}px`;

return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div className="react-flow__node-default" style={{ background: 'lightblue' }}>
    {data.label && <div>{data.label}</div>}
    
    <Handle type="target" position={Position.Top} />
    </div>
);
}