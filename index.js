var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var fs = require('fs');
var request = require('request');


var mysql      = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '2330972',
	database : 'sakila'
});
connection.connect();

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
    console.log(data);
	download(data.photoUrl, createName(data), function(){
	  console.log('done');
	});

	var query = createInsertQuery(data);
	console.log(query);
	
	connection.query('INSERT INTO sakila.test SET ?', query);

//	connection.end();

	res.end();

});

app.listen(3000, function () {
    console.info('Application has started!');
});

function download(uri, filename, callback){
	request.head(uri, function(err, res, body){
		console.log('content-type:', res.headers['content-type']);
		console.log('content-length:', res.headers['content-length']);
		console.log(filename);
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
	(data.date ? '.' + data.date.split(' ')[0] : '') +
	'.jpg'

}
/*
connection.connect();

var testQuery1 = "INSERT INTO sakila.test (id, age, height, weight, phoneNumber, photoUrl, date, url) VALUES (227746, 24, 175, 52, '256076177', 'http://intimby.net/datingphoto/227746.jpg', '2017-02-15 20:44:58', 'http://intimby.ne/cgi-bin/viewad.pl?id=227746');"
var testQuery2 = "INSERT INTO sakila.test (id, age, height, weight, phoneNumber, photoUrl, date, url, photoUrl) VALUES (010102, 22, 172, 52, '375290000002', 'test-url2', 'test-date2', 'tetsurltest2', 'test')"
connection.query(testQuery1, function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
});

connection.end();*/
// var testQuery1 = "INSERT INTO sakila.test (id, age, height, weight, phoneNumber, photoUrl, date, url) VALUES (227746, 24, 175, 52, '256076177', 'http://intimby.net/datingphoto/227746.jpg', '2017-02-15 20:44:58', 'http://intimby.ne/cgi-bin/viewad.pl?id=227746');"
function createInsertQuery(data) {

	var ID = +data.url.slice(-6);
	var AGE = (data.age ? +data.age : 0);
	var HEIGHT = (data.height ? +data.height : 0);
	var WEIGHT = (data.weight ? +data.weight : 0);
	var PHONE = (data.phoneNumber ? data.phoneNumber : "");
	var EMAIL = (data.email ? data.email : "");
	var PHOTO_URL = (data.photoUrl ? data.photoUrl : "");
	var DATE = data.date;
	var URL = data.url;
	var TEXT_INFO = (data.textInfo ? data.textInfo : "");

	var request = {
		id: ID,
		age: AGE,
		height: HEIGHT,
		weight: WEIGHT,
		phoneNumber: PHONE,
		photoUrl: PHOTO_URL,
		date: DATE,
		url: URL,
		textInfo: TEXT_INFO,
		email: EMAIL
	};
	var query = 'INSERT INTO sakila.test (id, age, height, weight, phoneNumber, photoUrl, date, url, textInfo) VALUES ('+ID+', '+AGE+', '+HEIGHT+', '+WEIGHT+', '+PHONE+', '+PHOTO_URL+', '+DATE+', '+URL+', '+ TEXT_INFO+ ')';

	return request;
}