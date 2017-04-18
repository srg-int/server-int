var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var fs = require('fs');
var request = require('request');
var Stream = require('stream').Transform;    


var mysql      = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '2330972',
	database : 'int'
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

app.get('/all', function (req, res) {
    res.sendFile(__dirname + '/all.html')
});

app.post('/allItems', function (req, res) {

/*	connection.query('DESCRIBE int.intimby', function(err, rows, fields) {
    	if (!err){
    		var fields = [];
    		rows.forEach(function(el){
    			fields.push(el.Field);
    		});
    		res.end(JSON.stringify(fields));
    	} else {
    		res.end(JSON.stringify(err));
    		console.error('Error while performing Query.');
    	}
    });
*/
	connection.query('SELECT * FROM int.intimby', function(err, rows, fields) {
    	if (!err){
    		res.end(JSON.stringify(rows.slice(-10)));
    	} else {
    		res.end(JSON.stringify(err));
    		console.error('Error while performing Query.');
    	}
    });

});

app.post('/nodeLogger', function (req, res) {
    console.log(req.body.counter);

    
    connection.query('SELECT * FROM sakila.test where counter=' + (req.body.counter || 1), function(err, rows, fields) {
    	if (!err){
//    		if (rows[0].photo) {
//    			fs.writeFileSync('image.png', rows[0].photo);
//    			fs.readFile('image.png', function(err, data) {
//				   var base64data = new Buffer(data).toString('base64');
//				   rows[0].base64data = base64data;
				   res.end(JSON.stringify(rows));
//				});

//    		}
    		
    	} else {
    		res.end(JSON.stringify(err));
    		console.log('Error while performing Query.');
    	}
    });
});

app.post('/int', function (req, res) {

    console.log(req.body);
	var query = createInsertQuery(req.body);
	if(req.body.photoUrl){

		var fileName = createName(req.body);
		

		download(req.body.photoUrl, fileName, function(){
			console.log(query);
			query.photo = fs.readFileSync(fileName)
			fs.readFile(fileName, function(err, data) {
				var base64data = new Buffer(data).toString('base64');
				query.photoBase64 = base64data;
				connection.query('INSERT INTO int.intimby SET ?', query);
				connection.query('INSERT INTO sakila.test SET ?', query);
				console.log('done: ', req.body.photoUrl);
			});
		});
	} else {
		connection.query('INSERT INTO int.intimby SET ?', query);
		connection.query('INSERT INTO sakila.test SET ?', query);
	}


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

//connection.connect();
/*
connection.query(`SELECT photo FROM sakila.test where counter=29;`, function(err, rows, fields) {
  if (!err){
	fs.writeFileSync('image.png', rows[0].photo);
	} else {
	console.log('Error while performing Query.');
		
	}
});

connection.end();*/
// var testQuery1 = "INSERT INTO sakila.test (id, age, height, weight, phoneNumber, photoUrl, date, url) VALUES (227746, 24, 175, 52, '256076177', 'http://intimby.net/datingphoto/227746.jpg', '2017-02-15 20:44:58', 'http://intimby.ne/cgi-bin/viewad.pl?id=227746');"

function createInsertQuery(data) {

	var ID = +data.url.slice(-6);
	var AGE = (data.age ? +data.age : null);
	var HEIGHT = (data.height ? +data.height : null);
	var WEIGHT = (data.weight ? +data.weight : null);
	var PHONE = (data.phoneNumber ? data.phoneNumber : null);
	var PHONESTR = (data.phoneNumber ? data.phoneNumber+'' : null);
	var EMAIL = (data.email ? data.email : null);
	var PHOTO_URL = (data.photoUrl ? data.photoUrl : null);
	var DATE = data.date;
	var URL = data.url;
	var TEXT_INFO = (data.textInfo ? data.textInfo : null);

	var request = {
		id: ID,
		age: AGE,
		height: HEIGHT,
		weight: WEIGHT,
		photoUrl: PHOTO_URL,
		date: DATE,
		url: URL,
		textInfo: TEXT_INFO,
		email: EMAIL,
		phoneStr: PHONESTR
	};

	return request;
}





