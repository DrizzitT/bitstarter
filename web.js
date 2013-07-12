var express = require('express');

var app = express.createServer(express.logger());

var text = '';

fs.readFile('/home/ubuntu/bitstarter/index.html', function (err,data) {
    if (err) throw err;
    text = console.log(data.toString('utf-8'));
});

app.get('/', function(request, response) {
  response.send(text);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
