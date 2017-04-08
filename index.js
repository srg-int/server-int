var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
const fs = require('fs');

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

app.use("/", express.static(__dirname + '/'));
app.use("/", express.static('../'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
});

app.post('/nodeLogger', function (req, res) {
    var data = req.body;

    res.end();
    console[data.level](data.data);
});

app.post('/int', function (req, res) {

    var data = req.body;
    console.log(data);
    res.end();
/*
    var request = require('request');
	request(data.location.href, function (error, response, body) {
  	if (!error && response.statusCode == 200) {
  		var ves = body.indexOf('Вес:');
  	    console.log(body);
  	}
})*/
});

app.listen(3000, function () {
    console.info('Application has started!');
});