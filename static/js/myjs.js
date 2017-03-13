/* global firebase */

// Setting up SVG
var width  = 1000,
    height = 1000,
    colors = d3.scale.category10();
var svg = d3.select('body')
  .append('svg')
  .attr('oncontextmenu', 'return false;')
  .attr('width', width)
  .attr('height', height);



// Initialize Firebase
var config = {
apiKey: "AIzaSyANn_1CLa3iR_BzVLPekTQdbqgsNuJRBqQ",
authDomain: "cc89-ba4c8.firebaseapp.com",
databaseURL: "https://cc89-ba4c8.firebaseio.com",
storageBucket: "cc89-ba4c8.appspot.com",
messagingSenderId: "188355216056"
};
firebase.initializeApp(config);
// Initialize the default app

console.log(firebase.app().name);  // "[DEFAULT]"
// Use the shorthand notation to retrieve the default app's services
var defaultStorage = firebase.storage();
var defaultDatabase = firebase.database();

// Get a reference to the database service
var database = firebase.database();
var writingLocation = database.ref('consumer');
var companyLocation = database.ref('test');

writingLocation.set({
  sign: "null", 
});

// Initializing number of nodes/edges
// n = number of nodes
// m = number of edges
var p = 25;
var n = 2 * p,
    m = 2 * p + 1;

// Initializing path length
var pl = 4;
updatepl();
function updatepl(){
  // check what company says
  firebase.database().ref('test').once('value').then(function(snapshot) {
    var done_val = snapshot.val().sign;
    var result = snapshot.val().test;
    console.log("beginning... reading company", done_val);
    if (done_val == "-") {
      pl = 3;
    } else if (done_val == "+"){
      pl = 5;
    }

    console.log(pl);
  });
}
console.log("actual pl",pl);
// Website names
var website_iterator = 0;
var websites = ['Google', 'Amazon', 'Facebook', 'Twitter', 'LinkedIn', 
                'Wikipedia', 'Yahoo', 'MSN', 'Youtube', 'Yelp',
                'Tumblr', 'eBay', 'Pinterest', 'Paypal', 'Imgur',
                'Netflix', 'Bing', 'Hulu', 'Wikia', 'IMDb',
                'Reddit', 'AOL', 'Craigslist', 'Instagram', 'Diply',
                'Live', 'Office', 'CNN', 'Chase', 'Blogspot',
                'ESPN', 'Twitch', 'Apple', 'Walmart', 'Caltech',
                'Weather', 'Breitbart', 'Microsoft', 'Zillow', 'Dropbox',
                'Asana', 'New Yorker', 'Asos', 'Twitch', 'Alibaba',
                'BlueApron', 'Square', 'Uniqlo', 'Weibo', 'Baidu',
                'Baidu', 'GitHub', 'PirateBay', 'Spotify', 'Vimeo',
                'UPS', 'PornHub', 'NBC', 'CBS', 'Disney'];
// notifications on losing security information
var info_iterator = 0;
var information = ['the street you grew up on', "your mother's maiden name", 'your username',
                  'your password', 'your first name', 'your last name', 
                  'your gender', 'your ethnicity', 'your security answer', 
                  'your date of birth', 'your home phone', 'your cell phone number', 
                  'your address', 'your credit card number', 'your csv', 
                  'your location', 'the websites you visit', 'the ads you click', 
                  'your device information', 'your IP address', 'your cookie data',
                  'the videos you watch', 'the websites you visit', 'your debit card number', 
                  'your SSN', 'all your user data'];

// Pushing the nodes
var nodes = [
  {id: 0, reflexive: false}
]
for(var i = 1; i < n; i++) {
  nodes.push({id: i, reflexive: false})
}
var lastNodeId = n - 1;

// Creates k random links on nodes
function createLink(nodes, k) {
  var linklist = [];
  var existing = {};
  for (var f = 0; f < n; f++) {
    existing[f] = [];
  }

  for (var i = 0; i < k; i++) {
    var idx1 = Math.floor(Math.random() * (n - 1));
    var idx2 = Math.floor(Math.random() * (n - 1));

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

    var entry = {source: nodes[idx1], target: nodes[idx2], left: false, right: false}
    linklist.push(entry);
  }

  return linklist;
}

// Creating m random links
var links = createLink(nodes, m);

// BFS to get distance of all nodes from node
function bfs(node, links) {
  var visited = [];
  var dists = [];
  var queue = [];

  traveled = [node.id];
  dists = [0];
  queue.push([node.id, 0]);

  while (queue.length !== 0) {
    var node = queue[0][0];
    var depth = queue[0][1];
    queue.shift();

    for (var i = 0; i < links.length; i++) {
      var search = links[i];
      if (search.source.id === node || search.target.id === node) {
        if (search.source.id === node) {
          var temp = search.target.id;
        }
        else {
          var temp = search.source.id;
        }

        if (!traveled.includes(temp)) {
          traveled.push(temp);
          dists.push(depth + 1);
          queue.push([temp, depth + 1]);
        }
      }
    }
  }

  var all_dists = [];

  for (var i = 0; i < dists.length; i++) {
    all_dists.push([traveled[i], dists[i]]);
  }

  return all_dists;
}

// Gets all paths with distance plength
function all_bfs(nodes, links, plength) {
  var paths = [];

  for (var i = 0; i < nodes.length; i++) {
    var all_dists = bfs(nodes[i], links);

    for (var j = 0; j < all_dists.length; j++) {
      if (all_dists[j][1] === plength) {
        paths.push([nodes[i].id, all_dists[j][0]]);
      }
    }
  }

  return paths;
}

// Gets random web path of plength
function get_path(nodes, links, plength) {
  var all_paths = all_bfs(nodes, links, plength);
  var rand_idx = Math.floor(Math.random() * (all_paths.length - 1));
  var rpath = all_paths[rand_idx];
  return rpath;
}

function check_done() {
  firebase.database().ref('test').once('value').then(function(snapshot) {
    var done_val = snapshot.val().sign;
    var result = snapshot.val().test;
    console.log("company p", result);
    console.log("company val", done_val);
    if (done_val == "+" || done_val == "-") {
      done = true;
    } else { done = false;}
  });
  console.log("checking if done?", done);
  // company is not done
  if (done == false) {
    console.log("Checking if done...")
    window.setTimeout(check_done, 1000);
  } else {
    // company is done
    console.log("company is done and so are you!");
    location.reload();
    firebase.database().ref('test').once('value').then(function(snapshot) {
      console.log("reseting company...");
      var result = snapshot.val().test;
      writingLocation.set({
        test: result,
        sign: "null", 
      });
    });
  }

}

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
var selected_node = nodes[0],
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

// Gets node by ID
function get_node_by_id(id) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      return nodes[i];
    }
  }
}

var rand_path = get_path(nodes, links, pl);
var start = get_node_by_id(rand_path[0]);
var fin = get_node_by_id(rand_path[1]);
start.reflexive = true;
var visited = [start];
selected_node = start;
var done = false;

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
      if (d3.event.ctrlKey) return;
      var mousedown_node = d;
      if (mousedown_node === selected_node) {
        selected_node.reflexive = true;
        restart();
      }
      if (mousedown_node === fin) {
        writingLocation.set({
          sign: "true", 
          // info: website_iterator,
        });
        check_done();
      }
      var adj = false;
      for (var i = 0; i < links.length; i++) {
        var search = links[i];
        if (search.source === selected_node && search.target === mousedown_node) {
            adj = true;
        }
        else if (search.source === mousedown_node && search.target === selected_node) {
            adj = true;
        }
        else if (visited.includes(search.source) && search.target === mousedown_node) {
            adj = true;
        }
        else if (search.source === mousedown_node && visited.includes(search.target)) {
            adj = true;
        }
      }
      if (adj) {
        curr_info = information[info_iterator];
        info_iterator++;
        $.notify("Warning: The company now knows " + curr_info, 
          {position: "right bottom", 
          className: 'warn'});

        selected_node = mousedown_node;
        selected_node.reflexive = true;
        visited.push(selected_node);
      }
      restart();
    });

  // Setting node names
  g.append('svg:text')
      .attr('x', 0)
      .attr('y', 4)
      .attr('class', 'id')
      .text(function(d) {
        currweb = websites[website_iterator];
        website_iterator++;
        return currweb
      });

  // Remove old nodes
  circle.exit().remove();

  // Start graph
  force.start();
}

// Set up text box
var start_node = document.getElementById("start");
var fin_node = document.getElementById("fin");
start_node.innerHTML = websites[rand_path[0]] + '.';
fin_node.innerHTML = websites[rand_path[1]] + '.';

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