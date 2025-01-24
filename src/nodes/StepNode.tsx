import { Handle, Position, type NodeProps } from '@xyflow/react';

import { type StepNode } from './types';

export function StepNode({
positionAbsoluteX,
positionAbsoluteY,
data,
}: NodeProps<StepNode>) {
const x = `${Math.round(positionAbsoluteX)}px`;
const y = `${Math.round(positionAbsoluteY)}px`;

return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div className="react-flow__node-default">
    {data.label && <div>{data.label}</div>}

    <Handle type="source" position={Position.Bottom} />
    <Handle type="target" position={Position.Top} />
    </div>
);
}