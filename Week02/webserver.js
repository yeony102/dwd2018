var express = require('express')
var app = express()


app.use(express.static('public'));


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


var smallHappiness = ["A Scone with Jam and Cream", "Honey Nut Cereal", "Belgian Beers"];

app.get('/areyouhappy', function (req, res) {
	var text = req.query.textfield;
	smallHappiness.push(text);
	var fileToSend = "happy.html";
	res.sendfile(fileToSend, {root: './public'});
})

app.get('/iamhappy', function (req, res) {

	var i = Math.floor(Math.random(smallHappiness.length-1));
	var html = "<html><body><h1><i>"
//	var html ="<html><body><div style=\"width: 50%; height: 50%; margin: auto; text-align:center; font-family:san-serif;\"><h1>"
	html = html + smallHappiness[i] + "</i> makes someone happy.</h1></body></html>"
	res.send(html);
})





