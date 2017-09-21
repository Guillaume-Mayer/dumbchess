// Modules
var express = require('express');
var chess = require('./dumb-chess');

// Get legal moves in algebraic notation and sorted
function getLegalMoves() {
	return chess.getLegalMoves()
		.map(
			function(m) {
				return chess.moveToStr(m);
			})
		.sort(
			function(a, b) {
				return a > b ? 1 : -1;
			});
}

// Restart the game by unplaying all history moves
function restart() {
   while(chess.history.length > 0) {
        chess.unplay(chess.history[chess.history.length - 1]);
    }
}

// Unplay the last move
function unplay() {
	// Check if there is one
	if (chess.history.length === 0) return;
	// Unplay the last move
	chess.unplay(chess.history[chess.history.length - 1]);
}

// Create the common response
function resp(res) {
	res.json({
		colorToPlay: chess.colorToPlay() == chess.BLACK ? 'Black' : 'White',
		fen: chess.posToFen(),
		legalMoves: getLegalMoves().map(function(m) {return '/chess/play/'+ m;}),
		actions: chess.history.length > 0 ? ['/chess/restart', '/chess/unplay'] : undefined,
		history: chess.history.map(function(m) {return chess.moveToStr(m);})
	});
}

// Express app
var app = express();

// Routes
app.get('/chess', function(req, res) {
	resp(res);
});
app.get('/chess/play/:move', function(req, res) {
	var moves = chess.getLegalMoves();
	var move;
	for (var m = 0; m < moves.length; m++) {
		if (chess.moveToStr(moves[m]) == req.params.move) {
			move = moves[m];
		}
	}
	if (move === undefined) {
		res.status(403).json({
			msg: 'Move [' + req.params.move + '] is not legal',
			history: chess.history.map(function(m) {return chess.moveToStr(m);})
		});
	} else {
		chess.play(move);
		resp(res);
	}
});
app.get('/chess/restart', function(req, res) {
	restart();
	resp(res);
});
app.get('/chess/unplay', function (req, res) {
	unplay();
	resp(res);
});

// Start the server
var port = 3000;
app.listen(port);
console.log('Server running at port ' + port);