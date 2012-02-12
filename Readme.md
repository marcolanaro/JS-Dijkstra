# JS-Dijkstra

Dijkstra's algorithm is a graph search algorithm that solves the single-source shortest path problem for a graph with nonnegative edge path costs, producing a shortest path tree. This algorithm is often used in routing and as a subroutine in other graph algorithms.

The algorithm is implemented inside a web workers so it provide a simple means to run the scripts in background threads.

### How to call the worker

	var worker = new Worker('./dijkstra.js');
	worker.onmessage = function(e) {
		alert( JSON.stringify(e.data) );
	};
	worker.postMessage(obj);

### Object passed to the script

For every node of the graph, list each node connected. The node is descripted by the object `{n:i, w:K}` where `i` is the id of the node connected and `K` the weight of the connection.

	{
		from: INTEGER,
		to: INTEGER,
		graph: {
			[{n: INTEGER, w: REAL}],
			[{n: INTEGER, w: REAL}, {n: INTEGER,w: REAL}],
			[{n: INTEGER, w: REAL}, {n: INTEGER,w: REAL}]
		}
	}

## Dijkstra in a Grid

You have the possibility to use Dijkstra's algorithm in a classic game map with `{x,y,z}` coordinates.
For use this worker you need a browser like Mozilla Firefox that support nested workers.

### How to call the worker

	var worker = new Worker('./dijkstra-grid.js');
	worker.onmessage = function(e) {
		alert( JSON.stringify(e.data) );
	};
	worker.postMessage(obj);

### Object passed to the script

In this case the graph is a grid of tile. Every tile is identified by `{x,y,z}` coordinates. Is very simple define the map: you have only to set a vector of `[x]` elements. For every element of `[x]` you have to define a vector of `[y]` elements. For every element of `[y]` you have to define a vector of `[z]` elements. You can choose to put all the `z` elemets you want but they have to be `true`.

	{
		diag: BOOLEAN,
		zeta: BOOLEAN,
		from: {x: INTEGER, y: INTEGER, z: INTEGER},
		to: {x: INTEGER, y: INTEGER, z: INTEGER},
		graph: [
			[[true],[true],[true],[true]],
			[[true],[true,true],[true],[true]],
			[[true],[true],[true],[true]]
		]
	}

You can choose if path of search can have diagonal with the `diag` variabel. You can also choose if the `z` elemets where `z > 0` are only obstacles or the path is search using also that elements.

The algorithm choose the shortest path, this the features:

1.  If exist the coordinate `{x,y,z}` the path can't be choose using the coordinate `{x,y,z-1}`.
2.  If there is two differents possibles path with the same number of movements, the algorithm choose always the one that remain in the same `z` coordinate.
