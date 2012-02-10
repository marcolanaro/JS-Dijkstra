Dijkstra's algorithm is a graph search algorithm that solves the single-source shortest path problem for a graph with nonnegative edge path costs, producing a shortest path tree. This algorithm is often used in routing and as a subroutine in other graph algorithms.

The algorithm is implemented inside a web workers so it provide a simple means to run the scripts in background threads.

# How to call the function

	var worker = new Worker('../dijkstra.js');
	worker.onmessage = function(e) {
		alert( JSON.stringify(e.data) );
	};  
	worker.postMessage(obj);

## Object passed to the script

For every node of the map, list each node connected. The node is descripted by the object '{n:i, w:K}' where 'i' is the id of the node connected and	'K' the weight of the connection.

	{
		from: id_start,
		to: id_finish,
		map: {
			[{n:1,w:50}],
			[{n:2,w:20}, {n:0,w:30}],
			[{n:0,w:10}, {n:1,w:10}]
		}
	}
