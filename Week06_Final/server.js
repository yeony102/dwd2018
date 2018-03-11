
var express = require('express');

//https://www.npmjs.com/package/ajax-request
//var request = require('ajax-request');

// https://expressjs.com/en/guide/routing.html
var app = express();

// https://www.npmjs.com/package/instagram-node
var instagram = require('instagram-node').instagram();
var config = require("./config.js");
var mongojs = require('mongojs');

var db = mongojs(config.db.username+":"+config.db.password+"@ds217898.mlab.com:17898/dwd2018", ["myInstagram"]);

var instaMedia = [];
var instaDB = [];
var at;



app.use(express.static('public'));

// body parser
// var bodyParser = require('body-parser');
// var urlencodedParser = bodyParser.urlencoded({ extended: true }); // for parsing form data
// app.use(urlencodedParser); 

app.set('view engine', 'ejs');

instagram.use({
	client_id: config.insta.clientId,
	client_secret: config.insta.clientSecret
});

var redirectUri = config.insta.redirectURI;

backup2DB = function(idx) {

  var savingData = {
    "id" : instaMedia[idx].id,
    "thumbnail" : instaMedia[idx].images.thumbnail.url,
    "standard" : instaMedia[idx].images.standard_resolution.url,
    "location" : {
      "latitude" : parseFloat(instaMedia[idx].location.latitude),
      "longitude" : parseFloat(instaMedia[idx].location.longitude),
      "name" : instaMedia[idx].location.name
    }
  };

  console.log("Saving media(id: " + savingData.id + ")...");

  db.myInstagram.save(savingData, function(err_insert, saved_insert) {
      if(err_insert || !saved_insert) {
        console.log("MongoDB: Failed to save");
      } else {
        console.log("MongoDB: Media(id: " + savingData.id + ") Saved.");
      }
  });   // save data

}

checkDB = function(idx) {

  var id = instaMedia[idx].id;

  db.myInstagram.find({ "id" : id }, function(err_find, saved_find) {

    if(err_find) { 
      console.log("MongoDB: Failed to search");

    } else if(!saved_find[0]) {

      //console.log(medias[i]);

      backup2DB(idx);


   } // if the data isn't in DB yet
    else {
      console.log("Found the media(id: " + id + ") in the DB. Not saving.");
      //break;
    } // if the data is found in DB
  }); // find data

};

exports.authorize_user = function(req, res) {
  res.redirect(instagram.get_authorization_url(redirectUri, { scope: ['basic'], state: 'a state' }));
};

exports.handleauth = function(req, res) {

  instagram.authorize_user(req.query.code, redirectUri, function(err, result) {

    if (err) {
      console.log("Failed to get the access token");
      res.send(err);

    } else {
      at = result.access_token;
      console.log("successfully got the access token");

      // console.log('Access token: ' + at);
      // console.log('User id: ' + result.user.id);
      // console.log('User name: ' + result.user.username);
      // console.log('Profile Picture: ' + result.user.profile_picture);

      instagram.use({
        client_id: config.insta.clientId,
        client_secret: config.insta.clientSecret,
        access_token: at
      });

      instagram.user_self_media_recent(function(err, medias, pagination, remaining, limit) {

        if(err) {
          console.log("Failed to load API");
          console.log(err);

        } else {
          instaMedia = medias;

          for(var i=0; i<instaMedia.length; i++) {

              var idnum = instaMedia[i].id;
            
            console.log("id: " + idnum);
            //checkDB(i, idnum, thumb, std, loc);
            checkDB(i);
            
          } // for loop

          res.redirect('/');
            
        } // successfully loaded Instagram API 

      }); // Instagram API

    //  res.render('index.ejs', { instaAuth : result, gmapKey: config.gmap.key } ); ///

    }

  });

};



// This is where you would initially send users to authorize 
app.get('/refresh', exports.authorize_user);

// This is your redirect URI 
app.get('/handleauth', exports.handleauth);

app.get('/', function (req, res) {

  db.myInstagram.find({}, function(err_pull, saved_pull) {
    if(err_pull || !saved_pull) {
      console.log("MongoDB: Failed to pull all records");
    } else {
      res.render('index.ejs', { dbdata: saved_pull, gmapKey: config.gmap.key });
    }
  }); // pull all records

});



app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
});


/*{
    "id": "1483203032275786092_46081876",
    "thumbnail": "https://scontent-lga3-1.cdninstagram.com/vp/b34231eb0686bd1db0cd36531c6a408c/5B374EC3/t51.2885-15/s150x150/e35/c135.0.810.810/17438504_1239184479510372_6493156662176645120_n.jpg",
    "standard": "https://scontent-lga3-1.cdninstagram.com/vp/0901ded33793a14e93de108e502f2c3f/5B34B6D2/t51.2885-15/e35/17438504_1239184479510372_6493156662176645120_n.jpg",
    "location": {
        "latitude": "37.819929",
        "longitude": "-122.478255",
        "name": "Golden Gate Bridge, San Francisco"
    }
}*/
