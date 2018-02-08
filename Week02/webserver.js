var express = require('express')
var app = express()


app.use(express.static('public'));


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


var smallHappiness = ["Scone with cream and jam", "", ""];

app.get('/areyouhappy', function (req, res) {
	var text = req.query.textfield;
	var html = "<html><body><div style=\"width: 50%; height: 50%; margin: auto; text-align:center; font-family:san-serif;\"><h1>"
	html = html + text + " makes you happy!</h1><p><br>Find out what other people answered</p><form method=\"GET\" action=\"/iamhappy\"><input type=\"submit\" name=\"showme\" value=\"Show me\" /></form></div></body></html>"
	res.send(html);
	smallHappiness.push(text);
})

app.get('/iamhappy', function (req, res) {

	var i = Math.floor(Math.random(smallHappiness.length-1));
	var html ="<html><body><div style=\"width: 50%; height: 50%; margin: auto; text-align:center; font-family:san-serif;\"><h1>"
	html = html + smallHappiness[i] + " is someone's small happiness.</h1></div></body></html>"
	res.send(html);
})





