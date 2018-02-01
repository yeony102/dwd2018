var express = require('express')
var app = express()


app.use(express.static('public'));

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/randomfile', function (req, res) {
	var fileToSend = "somerandomfile.txt";
	res.sendfile(fileToSend, {root: './public'}); // Files inside "public" folder
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})




