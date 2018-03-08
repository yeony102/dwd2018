
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

//instagram.use({ access_token: '46081876.90e3593.b8138ed621a84d6daf8925aefaa961ec'});

var redirectUri = config.insta.redirectURI;

exports.authorize_user = function(req, res) {
  res.redirect(instagram.get_authorization_url(redirectUri, { scope: ['basic'], state: 'a state' }));
};

exports.handleauth = function(req, res) {

  instagram.authorize_user(req.query.code, redirectUri, function(err, result) {

    if (err) {
      console.log(err.body);
      res.send("Didn't work");
    } else {
      console.log("Access token acquired");

      // console.log('Access token: ' + result.access_token);
      // console.log('User id: ' + result.user.id);
      // console.log('User name: ' + result.user.username);
      // console.log('Profile Picture: ' + result.user.profile_picture);
     
      /*
      // ajax-request
      var instaAPI = "https://api.instagram.com/v1/users/self/media/recent/?access_token=" + result.access_token;
      request({
        url: instaAPI,
        method: 'GET',
        // data: {
        //   access_token: result.access_token
        // }
      }, function(err, res, body) {
        if(err) {
          console.log("Failed to load API");
        } else { 
          console.log("Success!");
          console.log(res);
        }
      });*/

      instagram.use({
        access_token: result.access_token
      });

      instagram.user_self_media_recent(function(err, medias, pagination, remaining, limit) {

        if(err) {
          console.log("Failed to load API");
          console.log(err);
        } else {
          // console.log(medias);
          for(var i=0; i<medias.length; i++) {
            db.myInstagram.find({ "id" : medias[i].id }, function(err_find, saved_find) {
              if(err_find) { 
                console.log("MongoDB: Failed to search") 
              } else if(!saved_find) {
                var id = medias[i].id;
                var thumb = medias[i].images.thumbnail.url;
                var std = medias[i].images.standard_resolution.url;
                var loc = {
                  "latitude" : parseFloat(medias[i].location.latitude),
                  "longitude" : parseFloat(medias[i].location.longitude),
                  "name" : medias[i].location.name
                }

                db.myInstagram.save({
                  "id" : id,
                  "thumbnail" : thumb,
                  "standard" : std,
                  "location" : loc
                }, function(err_insert, saved_insert) {
                  if(err_insert || !saved_insert) console.log("MongoDB: Failed to save");
                  else console.log("MongoDB: Saved");
                });   // save data
              } // if the data isn't in DB yet
              else {
                //break;
              } // if the data is found in DB
            }); // find data
          } // for loop

          db.myInstagram.find({}, function(err_pull, saved_pull) {
            if(err_pull || !saved_pull) {
              console.log("MongoDB: Failed to pull all records");
            } else {
              res.render('index.ejs', { dbdata: saved_pull , gmapKey: config.gmap.key } );
            }
          }); // pull all records
            
        } // successfully loaded Instagram API 

      }); // Instagram API

    //  res.render('index.ejs', { instaAuth : result, gmapKey: config.gmap.key } ); ///

    }

  });

};

// This is where you would initially send users to authorize 
app.get('/', exports.authorize_user);

// This is your redirect URI 
app.get('/handleauth', exports.handleauth);



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
