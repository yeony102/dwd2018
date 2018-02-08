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

	var html = "<html><body><h1>";
	for(var i=0; i<smallHappiness.length; i++) {
		html = html + smallHappiness[i] + "<br>";
	}
	html = html + "</body></html>";
	res.send(html);
})





