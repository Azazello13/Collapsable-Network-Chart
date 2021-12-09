import { colors } from './colors';

export const nodes = [];
export const links = [];

const MAIN_NODE_SIZE = 40;
const CHILD_NODE_SIZE = 15;
const LEAF_NODE_SIZE = 5;
const DEFAULT_DISTANCE = 40;
const MAIN_NODE_DISTANCE = 40;
const LEAF_NODE_DISTANCE = 20;
export const MANY_BODY_STRENGTH = -50;

let i = 0;

const addMainNode = (node) => {
  node.size = MAIN_NODE_SIZE;
  node.color = colors[i++][1];
  nodes.push(node);
};

const addChildNode = (
  parentNode,
  childNode,
  size = CHILD_NODE_SIZE,
  distance = DEFAULT_DISTANCE
) => {
  childNode.size = size;
  childNode.color = parentNode.color;
  nodes.push(childNode);
  links.push({
    source: parentNode,
    target: childNode,
    distance,
    color: parentNode.color,
  });
};

const assembleChildNode = (parentNode, id, numLeaves = 1) => {
  const childNode = { id };
  addChildNode(parentNode, childNode);

  for (let i = 0; i < numLeaves; i++) {
    addChildNode(childNode, { id: 'new' }, LEAF_NODE_SIZE, LEAF_NODE_DISTANCE);
  }
};

const connectMainNodes = (source, target) => {
  links.push({
    source,
    target,
    distance: MAIN_NODE_DISTANCE,
    color: source.color
  });
};

const artsWeb = { id: 'Arts Web' };
addMainNode(artsWeb);
assembleChildNode(artsWeb, 'Community Vision');
assembleChildNode(artsWeb, 'Silicon Valley Creates');

const socialImpactCommons = { id: 'Social Impact Commons' };
addMainNode(socialImpactCommons);
assembleChildNode(socialImpactCommons, 'Theatre Bay Area');
assembleChildNode(socialImpactCommons, 'EastSide Arts Alliance');
assembleChildNode(socialImpactCommons, 'Local Color');

const cast = { id: 'Community Arts Stabilization Trust' };
addMainNode(cast);
assembleChildNode(cast, 'CounterPulse');
assembleChildNode(cast, 'Luggage Store Gallery');
assembleChildNode(cast, 'Performing Arts Workshop');
assembleChildNode(cast, '447 Minna St.', 5);
assembleChildNode(cast, 'Keeping Space Oakland');

const ambitioUS = { id: 'AmbitioUS' };
addMainNode(ambitioUS);
assembleChildNode(ambitioUS, 'EBPREC');
assembleChildNode(ambitioUS, 'SELC', 3);
assembleChildNode(ambitioUS, 'The Runway Project', 3);
assembleChildNode(ambitioUS, 'Common Future', 3);
assembleChildNode(ambitioUS, 'Freelancers Union', 3);
assembleChildNode(ambitioUS, 'US Federation of Worker Cooperatives', 3);

connectMainNodes(artsWeb, socialImpactCommons);
connectMainNodes(artsWeb, cast);
connectMainNodes(socialImpactCommons, cast);
connectMainNodes(ambitioUS, cast);
connectMainNodes(ambitioUS, socialImpactCommons);
connectMainNodes(ambitioUS, artsWeb);
