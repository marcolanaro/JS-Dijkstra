/*
Input Object:
	{
		from: 0,
		to: 6,
		map: [
			[{n:1,w:2}, {n:4,w:8}],
			[{n:0,w:2}, {n:2,w:6}, {n:3,w:2}],
			[{n:1,w:6}, {n:6,w:5}],
			[{n:1,w:2}, {n:4,w:2}, {n:5,w:9}],
			[{n:0,w:8}, {n:3,w:2}, {n:5,w:3}],
			[{n:3,w:9}, {n:4,w:3}, {n:6,w:1}],
			[{n:2,w:5}, {n:5,w:1}]
		]
	}
Map description.
	For every node, list each node connected.
	n: id of the node connected
	w: weight of the connection
*/
self.onmessage = function(event) {
	var obj = event.data,	
		V = {
			weight: [],
			found: [],
			father: []
		};
		
	// initialization
	for (var i = 0; i < obj.map.length; i += 1) {
		V.weight[i] = 10000000;
		V.found[i] = false;
		V.father[i] = -1;
	}
	
	// i know where i am
	V.found[obj.from] = true;
	V.weight[obj.from] = 0;
	
	// start the search
	var found = false;
	var node = obj.from;
	var node_old = node;
	while (!found) {
		// the most intelligent things to do is look the world around you
		for (var i = 0; i < obj.map[node].length; i += 1) {
			var new_weight = V.weight[node] + obj.map[node][i].w;
			if (V.weight[obj.map[node][i].n] > new_weight) {
				V.father[obj.map[node][i].n] = node;
				V.weight[obj.map[node][i].n] = new_weight;
			}
		}
		
		// i want to be light
		var light = 10000000;
		var lightest;
		for (var i = 0; i < obj.map.length; i += 1) {
			if (!V.found[i] && V.weight[i] <= light) {
				light = V.weight[i];
				lightest = i;
			}
		}
		
		// oh right, lightest you are safe ;)
		V.found[lightest] = true;
		
		// and now you are the boss!
		node = lightest;
		
		// oops... i iterate the same path: there is no way :(
		if (node == node_old)
			found = true;
		node_old = node;
		
		// you are a good monkey
		if (node == obj.to)
			found = true
	}
	
	// calculate the path
	var movement = new Array();
	if (V.found[obj.to]) {
		found = false;
		node = obj.to;
		while (!found){
			movement.push(node);
			node = V.father[node];
			if (obj.from == node)
				found = true;
		}
		// reverse
		var message=[];
		for (var i = movement.length; i > 0; i -= 1) {
			message.push(movement[i-1]);
		}
	}
		
	self.postMessage(message);
}
