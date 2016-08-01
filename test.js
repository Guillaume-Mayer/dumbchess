var express = require("express");

var app = express();

app.get("/chess", function(req, res) {
	res.setHeader("Content-Type", "text/plain");
	res.end("Liste des parties en attente");
})

.get("/chess/:game/join", function(req, res) {
	res.setHeader("Content-Type", "text/plain");
	res.end("Rejoindre la partie " + req.params.game);	
})

.use(function(req, res, next) {
	res.setHeader("Content-Type", "text/plain");
    res.status(404).send("Page introuvable");
});

app.listen(8080);