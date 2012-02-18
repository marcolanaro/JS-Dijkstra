var L1, L2, obj, graph = [];

self.onmessage = function(event) {
	self.postMessage({prova:1});
	obj = event.data;

	L1 = obj.graph.length;
	L2 = obj.graph[0].length;

	for (var x = 0; x < L1; x += 1) {
		for (var y = 0; y < L2; y += 1) {
			var c = obj.graph[x][y];
			for (var z = 0; z < c.length; z += 1) {
				var n = Grid2Vec({x: x, y: y, z: z});
				graph[n] = [];
				append(n, {x: x-1, y: y, z: z}, 2);
				append(n, {x: x+1, y: y, z: z}, 2);
				append(n, {x: x, y: y-1, z: z}, 2);
				append(n, {x: x, y: y+1, z: z}, 2);
				if (obj.diag) {
					append(n, {x: x-1, y: y-1, z: z}, 2);
					append(n, {x: x+1, y: y-1, z: z}, 2);
					append(n, {x: x-1, y: y+1, z: z}, 2);
					append(n, {x: x+1, y: y+1, z: z}, 2);
				}
				if (obj.zeta) {
					append(n, {x: x-1, y: y, z: z+1}, 3);
					append(n, {x: x+1, y: y, z: z+1}, 3);
					append(n, {x: x, y: y-1, z: z+1}, 3);
					append(n, {x: x, y: y+1, z: z+1}, 3);
					append(n, {x: x-1, y: y, z: z-1}, 3);
					append(n, {x: x+1, y: y, z: z-1}, 3);
					append(n, {x: x, y: y-1, z: z-1}, 3);
					append(n, {x: x, y: y+1, z: z-1}, 3);
					if (obj.diag) {
						append(n, {x: x-1, y: y-1, z: z+1}, 3);
						append(n, {x: x+1, y: y-1, z: z+1}, 3);
						append(n, {x: x-1, y: y+1, z: z+1}, 3);
						append(n, {x: x+1, y: y+1, z: z+1}, 3);
						append(n, {x: x-1, y: y-1, z: z-1}, 3);
						append(n, {x: x+1, y: y-1, z: z-1}, 3);
						append(n, {x: x-1, y: y+1, z: z-1}, 3);
						append(n, {x: x+1, y: y+1, z: z-1}, 3);
					}
				}
			}
		}
	}

	var m = dijkstra({
		from: Grid2Vec(obj.from),
		to: Grid2Vec(obj.to),
		graph: graph
	});

	var v = new Array();
	for (var i = 0; i < m.length; i += 1)
		v[i] = Vec2Grid(m[i]);
	self.postMessage(v);
}

append = function(n, c, w) {
	if (obj.graph[c.x] && obj.graph[c.x][c.y] && obj.graph[c.x][c.y][c.z])
		if (!obj.graph[c.x][c.y][c.z+1])
			graph[n].push({n: Grid2Vec(c), w: w});
}

Vec2Grid = function(n) {
	var z = Math.floor(n / (L1 * L2));
	n = n - z * L1 * L2;
	return {
		x: (n % L1),
		y: Math.floor(n / L1),
		z: z
	}		
}

Grid2Vec = function(c) {
	return c.x + c.y * L1 + c.z * L1 * L2;			
}

dijkstra = function(obj) {
	var V = {
			weight: [],
			found: [],
			father: []
		};
		
	// initialization
	for (var i = 0; i < obj.graph.length; i += 1) {
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
		for (var i = 0; i < obj.graph[node].length; i += 1) {
			var new_weight = V.weight[node] + obj.graph[node][i].w;
			if (V.weight[obj.graph[node][i].n] > new_weight) {
				V.father[obj.graph[node][i].n] = node;
				V.weight[obj.graph[node][i].n] = new_weight;
			}
		}
		
		// i want to be light
		var light = 10000000;
		var lightest;
		for (var i = 0; i < obj.graph.length; i += 1) {
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
		
	return message;
}
