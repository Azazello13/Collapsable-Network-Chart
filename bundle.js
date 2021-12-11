(function (d3) {
  'use strict';

  // Generated with https://paletton.com/#uid=75x0u0kigkU8ZuBdTpdmbh6rjc7
  const colors = [
    ['#9D4452', '#E6A6B0', '#BE6B78', '#812836', '#5B0D1A'],
    ['#A76C48', '#F4CAAF', '#C99372', '#884E2A', '#602E0E'],
    ['#2E6B5E', '#719D93', '#498175', '#1B584A', '#093E32'],
    ['#538E3D', '#A6D096', '#75AC61', '#3A7424', '#1F520C'],
  ];

  const nodes = [];
  const links = [];

  const MAIN_NODE_SIZE = 40;
  const CHILD_NODE_SIZE = 15;
  const LEAF_NODE_SIZE = 5;
  const DEFAULT_DISTANCE = 15;
  const MAIN_NODE_DISTANCE = 200;
  const LEAF_NODE_DISTANCE = 20;
  const MANY_BODY_STRENGTH = -30;
   
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
    childNode.parent=parentNode.id;
    childNode.root=parentNode.parent,
    
    nodes.push(childNode);
    links.push({
      root:parentNode.parent,
      source: parentNode,
      target: childNode,
      distance,
      main:0,
      color: parentNode.color,
    });
  };

  const assembleChildNode = (parentNode, id, numLeaves = 0) => {
    const childNode = { id };
    addChildNode(parentNode, childNode);

    for (let i = 0; i < numLeaves; i++) {
      addChildNode(childNode, { id: '' }, LEAF_NODE_SIZE, LEAF_NODE_DISTANCE);
    }
  };





  const connectMainNodes = (source, target) => {
    links.push({
      source,
      target,
      distance: MAIN_NODE_DISTANCE,
      color: source.color,
      main:1

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

  //console.log(nodes.filter(array => {return array.parent== "Community Vision"}));
  console.log(nodes);
  console.log(links);
//links.forEach(link => {console.log(link.distance) });
  const svg = d3.select('#container');
  const width = +svg.attr('width');
  const height = +svg.attr('height');
  const centerX = width / 2;
  const centerY = height / 2;

  const simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(node => {
      if(node.size==50){
        return -5}
      else{return -30}
    }))
    .force(
      'link',
      d3.forceLink(links).distance((link) => link.distance)
    )
    .force('collide', d3.forceCollide(node => {return  node.size +5})) 
    .force('center', d3.forceCenter(centerX, centerY));

  const dragInteraction = d3.drag().on('drag', (event, node) => {
    node.fx = event.x;
    node.fy = event.y;
    simulation.alpha(0.7);
    simulation.restart();
  });


  const lines = svg
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('sourceCircle',link => link.source.id)
    .attr('root',(link) => link.root)
    .attr('stroke', (link) => link.color || 'black')
    .attr('main',(link) => link.main);



  

  const circles = svg
    .selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('fill', (node) => node.color || 'gray')
    .attr('r', (node) => node.size)
    .attr('parent', (node) => node.parent)
    .attr('root', (node) => node.root)
    .attr('id', (node) => node.id)
    .call(dragInteraction)
    .on('mouseover', function (d, i) {
      

      d3.select(this).transition()
           .duration('50')
           .attr('opacity', '.65')})
     .on('mouseout', function (d, i) {
            d3.select(this).transition()
                 .duration('50')
                 .attr('opacity', '1')})
      .on('click',function(){
                  const nodeid=this.id;
                  //console.log(nodes.filter(array => {return array.parent=== nodeid}));


                  const linii=d3.selectAll('line').filter(function() { 
                    
                    const selection=d3.select(this);
                    return (selection.attr("sourceCircle") == nodeid&&selection.attr("main") == "0")||selection.attr("root") == nodeid;});





                  const krugi=d3.selectAll('circle').filter(function() { 
                    
                    const selection=d3.select(this);
                    return selection.attr("parent") === nodeid||selection.attr("root") == nodeid;});
                  
                  
                  const texty=d3.selectAll('text').filter(function() { return d3.select(this).attr("sourceCircle") === nodeid;});
                
 

                  const visibility = krugi.style("visibility")=="hidden" ? "visible" : "hidden";

                  
                  
                  krugi.style("visibility", visibility);

                  
                  linii.style("visibility", visibility);

                  texty.style("visibility", visibility);
                 

                  
                });

  
  

  const text = svg
    .selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .attr('sourceCircle', (node) => node.parent)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .style('pointer-events', 'none')
    .text((node) => node.id);

  
    const hiding = svg.selectAll('circle')
    



  simulation.on('tick', () => {
    circles.attr('cx', (node) => node.x).attr('cy', (node) => node.y);
    text.attr('x', (node) => node.x).attr('y', (node) => node.y);
    //circles2.attr('x', (node) => node.x).attr('y', (node) => node.y);
    lines
      .attr('x1', (link) => link.source.x)
      .attr('y1', (link) => link.source.y)
      .attr('x2', (link) => link.target.x)
      .attr('y2', (link) => link.target.y);
  });

}(d3));
