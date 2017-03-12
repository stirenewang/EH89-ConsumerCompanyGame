// Setting up SVG
var width  = 1000,
    height = 1000,
    colors = d3.scale.category10();
var svg = d3.select('body')
  .append('svg')
  .attr('oncontextmenu', 'return false;')
  .attr('width', width)
  .attr('height', height);

// Initializing number of nodes/edges
// n = number of nodes
// m = number of edges
var p = 25;
var n = 2 * p,
    m = 2 * p + 10;

// Website names
var websites = ['Google', 'Amazon', 'Facebook', 'Twitter', 'LinkedIn', 
                'Wikipedia', 'Yahoo', 'MSN', 'Youtube', 'Yelp',
                'Tumblr', 'eBay', 'Pinterest', 'Paypal', 'Imgur',
                'Netflix', 'Bing', 'Hulu', 'Wikia', 'IMDb',
                'Reddit', 'AOL', 'Craigslist', 'Instagram', 'Diply',
                'Live', 'Office', 'CNN', 'Chase', 'Blogspot', 'ESPN',
                'Twitch', 'Apple', 'Walmart', 'Caltech', 'Weather',
                'Breitbart', 'Microsoft', 'Zillow', 'Dropbox', 'Asana',
                'New Yorker', 'Asos', 'Forever 21', 'Twitch', 'BlueApron',
                'Square', 'Uniqlo', 'Weibo', 'WeChat', 'Baidu',
                'GitHub', 'PirateBay', 'Spotify', 'Vimeo', 'UPS', 
                'citi', "Macy's", ];

// Pushing the nodes
nodes = [
  {id: 0, reflexive: false}
]
for(var i = 1; i < n; i++) {
  nodes.push({id: i, reflexive: false})
}
var lastNodeId = n - 1;

// Function: creates k random links on nodes
function createLink(nodes, k){
  var linklist = [];
  var existing = {};
  for (var f = 0; f < n; f++) {
    existing[f] = [];
  }

  for (var i = 0; i < k; i++) {
    idx1 = Math.floor(Math.random() * (n - 1));
    idx2 = Math.floor(Math.random() * (n - 1));

    while (idx2 == idx1) {
      idx2 = Math.floor(Math.random() * (n - 1));
    }

    while (existing[idx1].includes(idx2) || existing[idx2].includes(idx1)) {
      idx1 = Math.floor(Math.random() * (n - 1));
      idx2 = Math.floor(Math.random() * (n - 1));

      while (idx2 == idx1) {
        idx2 = Math.floor(Math.random() * (n - 1));
      }
    }

    existing[idx1].push(idx2);
    existing[idx2].push(idx1);

    entry = {source: nodes[idx1], target: nodes[idx2], left: false, right: false}
    linklist.push(entry);
  }

  return linklist;
}

// Creating m random links
var links = createLink(nodes, m);

// Creates a path that is plength long
function getPath(plength, links){
  var traveled = {},
      path = [];

  for (var f = 0; f < n; f++) {
    traveled[f] = [];
  }
  // first node
  curr = links[0];
  console.log("source", curr.source.id, "target", curr.target.id);
  traveled[curr.source.id].push(curr.target.id);
  traveled[curr.target.id].push(curr.source.id);
  path.push(curr);

  startnode = curr.target.id;
  while (plength > 0) {
    // search through links list for a next node
    found = false;
    for (var i = 0; i < links.length; i++) {
      search = links[i];
      if (search.source.id == startnode || search.target.id == startnode) {
        if (search.source.id == startnode) {
          temp = search.target.id;
        } else {
          temp = search.source.id;
        }

        if (traveled[search.source.id].includes(search.target.id) == false) {
          nextNode = search;
          nextfound = temp;
          found = true;
        } else {
          nextnotfound = temp;
          backup = search;
        }
      }
    }
    // not found
    if (found == false) {
      console.log("repeat");
      curr = backup;
      startnode = nextnotfound;
    } else {
      curr = nextNode;
      startnode = nextfound;
    }
    console.log("source", curr.source.id, "target", curr.target.id);
    traveled[curr.source.id].push(curr.target.id);
    traveled[curr.target.id].push(curr.source.id);
    path.push(curr);
    plength--;
  }

}

var pathlength = Math.floor(p / 2);
var path = getPath(pathlength, links);

// Initialize D3 force layout
var force = d3.layout.force()
  .nodes(nodes)
  .links(links)
  .size([width, height])
  .linkDistance(150)
  .charge(-500)
  .on('tick', tick);

// Initializing arrow markers for graph links
svg.append('svg:defs').append('svg:marker')
  .attr('id', 'end-arrow')
  .attr('viewBox', '0 -5 10 10')
  .attr('refX', 6)
  .attr('markerWidth', 3)
  .attr('markerHeight', 3)
  .attr('orient', 'auto')
  .append('svg:path')
  .attr('d', 'M0,-5L10,0L0,5')
  .attr('fill', '#000');
svg.append('svg:defs').append('svg:marker')
  .attr('id', 'start-arrow')
  .attr('viewBox', '0 -5 10 10')
  .attr('refX', 4)
  .attr('markerWidth', 3)
  .attr('markerHeight', 3)
  .attr('orient', 'auto')
  .append('svg:path')
  .attr('d', 'M10,-5L0,0L10,5')
  .attr('fill', '#000');

// Initializing handles to link and node element groups
var path = svg.append('svg:g').selectAll('path'),
    circle = svg.append('svg:g').selectAll('g');

// Initializing mouse event variables
var selected_node = null,
    selected_link = null,
    mousedown_link = null,
    mousedown_node = null,
    mouseup_node = null;

// Resetting mouse event variables
function resetMouseVars() {
  mousedown_node = null;
  mouseup_node = null;
  mousedown_link = null;
}

// Updates force layout (called automatically each iteration)
function tick() {
  path.attr('d', function(d) {
    var deltaX = d.target.x - d.source.x,
        deltaY = d.target.y - d.source.y,
        dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
        normX = deltaX / dist,
        normY = deltaY / dist,
        sourcePadding = d.left ? 17 : 12,
        targetPadding = d.right ? 17 : 12,
        sourceX = d.source.x + (sourcePadding * normX),
        sourceY = d.source.y + (sourcePadding * normY),
        targetX = d.target.x - (targetPadding * normX),
        targetY = d.target.y - (targetPadding * normY);

    return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
  });

  circle.attr('transform', function(d) {
    return 'translate(' + d.x + ',' + d.y + ')';
  });
}


website_iterator = 0;

// Updates graph (called when needed)
function restart() {
  path = path.data(links);

  // Update existing links
  path.classed('selected', function(d) {return d === selected_link;})
    .style('marker-start', function(d) {return d.left ? 'url(#start-arrow)' : '';})
    .style('marker-end', function(d) {return d.right ? 'url(#end-arrow)' : '';});

  // Add new links
  path.enter().append('svg:path')
    .attr('class', 'link')
    .classed('selected', function(d) {return d === selected_link;})
    .style('marker-start', function(d) {return d.left ? 'url(#start-arrow)' : '';})
    .style('marker-end', function(d) {return d.right ? 'url(#end-arrow)' : '';})
    .on('mousedown', function(d) {
      if(d3.event.ctrlKey) return;
      mousedown_link = d;
      if(mousedown_link === selected_link) selected_link = null;
      else selected_link = mousedown_link;
      selected_node = null;
      restart();
    });

  // Remove old links
  path.exit().remove();


  circle = circle.data(nodes, function(d) {return d.id;});

  // Update existing nodes (reflexive and selected visual states)
  circle.selectAll('circle')
    .style('fill', function(d) {return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id);})
    .classed('reflexive', function(d) {return d.reflexive;});

  // Add new nodes
  var g = circle.enter().append('svg:g');
  g.append('svg:circle')
    .attr('class', 'node')
    .attr('r', 12)
    .style('fill', function(d) {return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id);})
    .style('stroke', function(d) {return d3.rgb(colors(d.id)).darker().toString();})
    .classed('reflexive', function(d) {return d.reflexive;})
    .on('mousedown', function(d) {
      if(d3.event.ctrlKey) return;
      mousedown_node = d;
      if(mousedown_node === selected_node) selected_node = null
      else {
        selected_node = mousedown_node;
        selected_node.reflexive = true;
      }
      selected_link = null;
      restart();
    })
    .on('mouseup', function(d) {
      if(!mousedown_node) return;
      mouseup_node = d;
      if(mouseup_node === mousedown_node) {resetMouseVars(); return;}

      // Add link to graph (update if exists)
      var source = mousedown_node,
          target = mouseup_node;

      var link = links.filter(function(l) {
        return (l.source === source && l.target === target);
      })[0];

      link = {source: source, target: target, left: false, right: false};
      links.push(link);

      selected_link = link;
      selected_node = null;
      restart();
    });

  // Setting node names
  g.append('svg:text')
      .attr('x', 0)
      .attr('y', 4)
      .attr('class', 'id')
      .text(function(d) {
        //websites[Math.floor(Math.random() * (websites.length - 1))];
        currweb = websites[website_iterator];
        //console.log(website_iterator, currweb);
        website_iterator++;
        return currweb
      });

  // Remove old nodes
  circle.exit().remove();

  // Start graph
  force.start();
}

function mousedown() {
  svg.classed('active', true);
  if(d3.event.ctrlKey || mousedown_node || mousedown_link) return;
  restart();
}

function mouseup() {
  svg.classed('active', false);
  resetMouseVars();
}

// App starts here
svg.on('mousedown', mousedown)
  .on('mouseup', mouseup);
restart();