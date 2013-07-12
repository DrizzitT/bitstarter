var express = require('express');

var app = express.createServer(express.logger());

var fs = require('fs'); 

var text = fs.readFileSync('/home/ubuntu/bitstarter/index.html').toString('utf-8');

app.get('/', function(request, response) {
  response.send(console.log(text));
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
  console.log(text);
});
