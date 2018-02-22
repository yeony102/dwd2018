var express = require('express');
var app = express();

// body parser
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true }); // for parsing form data
app.use(urlencodedParser); 

// mongo DB
var config = require("./config.js");
var mongojs = require('mongojs');
//var db = mongojs(config.username+":"+config.password+"@ds217898.mlab.com:17898/dwd2018");
var db = mongojs(config.username+":"+config.password+"@ds217898.mlab.com:17898/dwd2018", ["happythings"]);

// ejs
app.set('view engine', 'ejs');	// all render files(.ejs) are called from 'views' folder by default


app.use(express.static('public'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

app.get('/areyouhappy', function (req, res) {
	var text = req.query.textfield;
	
	db.happythings.save({"happy":text}, function(err, saved) {
		if( err || !saved ) console.log("Not saved");
		else console.log("Saved");
	});

	res.redirect('/youarehappy');
})


app.get('/youarehappy', function (req, res) {
	db.happythings.find({}, function(err, saved) {
		if(err || !saved) console.log("Not saved");
		else {
			console.log(saved);
			res.render('happy.ejs', {dbdata:saved});
		}
	});
})


/*
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
*/





