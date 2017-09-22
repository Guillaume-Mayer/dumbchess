// Modules
const express = require('express')
const chess = require('./dumb-chess')
const morgan = require('morgan')

// Get legal moves in algebraic notation and sorted
function getLegalMoves() {
	return chess.getLegalMoves()
		.map(
			function(m) {
				return chess.moveToStr(m)
			})
		.sort(
			function(a, b) {
				return a > b ? 1 : -1
			})
}

// Restart the game by unplaying all history moves
function restart() {
   while(chess.history.length > 0) {
        chess.unplay(chess.history[chess.history.length - 1])
    }
}

// Unplay the last move
function unplay() {
	// Check if there is one
	if (chess.history.length === 0) return
	// Unplay the last move
	chess.unplay(chess.history[chess.history.length - 1])
}

// Create the common response
function resp(res) {
	res.json({
		colorToPlay: chess.colorToPlay() == chess.BLACK ? 'Black' : 'White',
		fen: chess.posToFen(),
		legalMoves: getLegalMoves().map(function(m) {return '/chess/play/'+ m;}),
		actions: chess.history.length > 0 ? ['/chess/restart', '/chess/unplay'] : undefined,
		history: chess.history.map(function(m) {return chess.moveToStr(m);})
	})
}

// Express app
const app = express()

// Log
//app.use(morgan('tiny'))

// Routes
app.get('/chess', function(req, res) {
	resp(res)
})

app.get('/chess/play/:move', function(req, res) {
	if (chess.history.length > 0) {
		if (chess.moveToStr(chess.history[chess.history.length - 1]) === req.params.move) {
			console.log("Move = Last Move ", req.params.move, "(Jersey calls twice sometimes but the rest api is not stateless)")
			res.end()
			return
		}
	}
	const moves = chess.getLegalMoves()
	for (var m = 0; m < moves.length; m++) {
		if (chess.moveToStr(moves[m]) === req.params.move) {
			break
		}
	}
	if (m === moves.length) {
		res.status(403).end()
	} else {
		chess.play(moves[m])
		resp(res)
	}
})

app.get('/chess/restart', function(req, res) {
	restart()
	resp(res)
})

app.get('/chess/unplay', function(req, res) {
	unplay()
	resp(res)
})

app.post('/chess', function(req, res) {
	req.body.history.forEach(m => chess.play(m))
	resp(res)
})

// Start the server
const port = 3000
app.listen(port)
console.log('Server running at port ' + port)