
var express = require('express')
var app = express()


app.use(express.static('public'));

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})

app.get('/ifeellike', function (req, res) {
	var feeling = req.query.textfield;
	// var data = { you: { mood: feeling } };

	// res.render('feellike.ejs', data);

	var html = "<html><head><script src=\"http://code.jquery.com/jquery-1.11.2.min.js\"></script>";
	html = html + "</head><body><div><span>You feel like </span><span id=\"mood\">"+feeling+"</span><span> today</span></div>";
	html = html + "<img src=\"\"></body><script src=\"./ajax.js\"></script></body></HTML>";
	res.send(html);
})
