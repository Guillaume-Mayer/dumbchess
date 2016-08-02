// Modules needed
var express = require("express");

// Routes for dumbchess API
var router = express.Router();

router.get("/", function(req, res) {
	res.json({ msg: "Welcome to my REST api"});
});

router.get("/:game/join", function(req, res) {
	res.json({ msg: "Rejoindre la partie " + req.params.game});	
});

// Express app
var app = express();

// Runs in /chess
app.use("/chess", router);
app.use(function(req, res) {
	res.status(404).end();
})

// Start the server
var port = 8080;
app.listen(port);
console.log("Server running at port " + port);