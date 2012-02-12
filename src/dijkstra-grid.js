var L1, L2, obj, graph = [];
var worker = new Worker('dijkstra.js');

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
	self.postMessage({prova:2});

	worker.onmessage = function(e) {
		var v = new Array();
		for (var i = 0; i < e.data.length; i += 1)
			v[i] = Vec2Grid(e.data[i]);
		self.postMessage(v);
	};  
	worker.postMessage({
		from: Grid2Vec(obj.from),
		to: Grid2Vec(obj.to),
		graph: graph
	});
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
