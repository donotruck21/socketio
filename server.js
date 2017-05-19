// require express and path
var express = require("express");
var path = require("path");

// create the express app
var app = express();

// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// root route to render the index.ejs view
app.get('/', function(req, res) {
 res.render("index");
})

// tell the express app to listen on port 8000
var server = app.listen(8000, function() {
 console.log("listening on port 8000");
})
