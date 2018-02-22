
var express = require('express')
var app = express()

var config = require("./config.js")

var mongojs = require('mongojs')
var db = mongojs(config.username+":"+config.password+"@ds217898.mlab.com:17898/dwd2018")

app.use(express.static('public'));
app.set('view engine', 'ejs');	// all render files(.ejs) are called from 'views' folder by default

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})

// insert
db.submissions.save( { "attribute_to_save" :"value_to_save"}, function(err,saved) {
	if(err || !saved) console.log("Not saved");
	else console.log("Saved");
});

// pull all records
db.mycollection.find({}, function(err, saved) {
	if(err || !saved) {
		console.log("No results");
	}
	else {
		saved.forEach(function(record) {
			console.log(record);
		/*
		// Alternative #1
		for(var i=0; i<saved.length; i++) {
			console.log(saved[i]);
		}
		*/
		/*
		// Alternative #2
		for record in saved {
			console.log(record); // this is es6. may not be supported by Digital Ocean
		}
		*/
		})
	}
});

// Search for records
db.mycollection.find({"attribute":"value_to_search_for"}, function(err, saved) {
	app.get('/search', function(req, res) {
		var query = new RegExp(req.query.q, 'i');
		db.mycollection.find( {"attribute": query}, function(err, saved) {
			if(err || !saved) console.log("No results");
			else res.send(saved);
		});
	});
});


// 
app.get('/search', function(req, res) {
	var query = new RegExp(req.query.q, 'i');
	db2.posts.find( {"keywords": query},
		function(err, saved) {
			if( err || !saved) console.log("No results");
			else res.send(saved);
		});
});

var submissions_array = [];



// need body parser
app.post('/formpost', function (req, res) {
	var textValue = req.body.textfield;
	res.send("You submitted: " + textValue);
//	archive.push(textValue);
	db.submission.save()({"submission":req.body.textfield}, function(err, saved) {
  		if( err || !saved ) console.log("Not saved");
  		else console.log("Saved");
  	});

});

app.get('/display' function(req, res) {
	db.submission.find({}, function(err, saved) {
		if (err || !saved) {
  			console.log("No results");
	    }
	    else {
		  	saved.forEach(function(record) {
		    	console.log(record);
		    	res.render('display.ejs', {submissions_on_page:submissions_array});
		  	});
		  	
	  	/* Alternatively you could loop through the records with a "for"
	  	for (var i = 0; i < saved.length; i++) {
		  	console.log(saved[i]);
		}
		*/  	
	  }
	})
})

// app.get('/display', function(req, res) {

// 	res.render('display.ejs', {submissions_on_page:submissions_array});
// })