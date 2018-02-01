var express = require('express')
var app = express()


app.use(express.static('public'));


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/somethingelse', function (req, res) {
  res.send('<html><body><h1>Someting Else</h1></body></html>');
})

app.get('/randomfile', function (req, res) {
	var fileToSend = "somerandomfile.txt";
	res.sendfile(fileToSend, {root: './public'}); // Files inside "public" folder
})

var archive = [];

app.get('/formpost', function (req, res) {
	var textValue = req.query.textfield;
	res.send("You submitted: " + textValue);
	archive.push(textValue);
})

app.get('/display', function (req, res) {
	var html = "<html><body>";
	for(var i=0; i<archive.length; i++) {
		html = html + archive[i] + "<br>";
	}
	html = html + "</body></html>";
	res.send(html);
})





