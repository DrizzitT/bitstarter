var express = require('express');

var app = express.createServer(express.logger());

fs.readFileSync('/bitstarter/index.html', function (err, data){
 if (err) throw err;
  var buffer = new bBuffer(data);
});
 
app.get('/', function(request, response) {
  response.send(buffer);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
