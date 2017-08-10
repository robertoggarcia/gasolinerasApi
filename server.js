//roberto
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var prices = require('./routes/prices');
var places = require('./routes/places');
var port = 3002;
var app = express();

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Set Static Folder
app.use(express.static(path.join(__dirname, 'client')));

// Body Parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', index);
app.use('/prices', prices);
app.use('/places', places);

app.listen(port, function(){
	log("Server started on port " + port);
});

function log(text) {
	console.log(new Date + ": " + text);
}