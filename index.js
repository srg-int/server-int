var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var fs = require('fs');
var request = require('request');

var app = express();


const PHOTO_DIR	= 'C:\\cloud.mail.ru\\intPhoto\\';

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json({limit: '10mb'}));

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

	download(data.photoUrl, createName(data), function(){
	  console.log('done');
	});

    res.end();

});

app.listen(3000, function () {
    console.info('Application has started!');
});

function download(uri, filename, callback){
	request.head(uri, function(err, res, body){
		console.log('content-type:', res.headers['content-type']);
		console.log('content-length:', res.headers['content-length']);
		request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
	});
};

function createName(data) {
	return PHOTO_DIR + 
	data.url.slice(-6) + 
	(data.age ? '.' + data.age : '') +
	(data.height ? '.' + data.height : '') +
	(data.weight ? '.' + data.weight : '') +
	(data.phoneNumber ? '.' + data.phoneNumber : '') +
	'.' + data.date.split(' ')[0] + 
	'.jpg'

}
