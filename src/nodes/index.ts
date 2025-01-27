import type { NodeTypes } from '@xyflow/react';

import { PositionLoggerNode } from './PositionLoggerNode';
import { StepNode } from './StepNode';
import { ExampleNode } from './ExampleNode';
import { AppNode } from './types';

export const initialNodes: AppNode[] = [
  { id: 'a', type: 'step', position: { x: 0, y: 0 }, data: { label: 'Step 1: Conduct Content Scans', description: " Begin by scanning incoming emails for suspicious content. This includes looking for common phishing indicators such as urgent language, requests for sensitive information, and unusual attachments." } },
  {
    id: 'b', type: 'step',
    position: { x: 0, y: 100 },
    data: { label: 'Step 2: Request Packet Capture', description: "If a suspicious email is identified, request packet captures to analyze the traffic associated with the email. This can help in identifying the source and any malicious links." },
  },
  { id: 'c',type: 'step', position: { x: 0, y: 200 }, data: { label: 'Step 3: Categorize Incident', description: "Establish specific threat indicators to look for: Identification of spoofed emails. Emails linked to external or unknown URLs.Emails returned by mail servers as identified threats." } },
  {
    id: 'd',type: 'step',
    position: { x: 0, y: 300 },
    data: { label: 'Step 4: Define Threat Indicators', description: "Define" },
  },
];

export const nodeTypes = {
  'position-logger': PositionLoggerNode,
  'step': StepNode,
  'example': ExampleNode
  // Add any of your custom nodes here!
} satisfies NodeTypes;


