var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.redirect('./seat.html');
});


app.listen(process.env.PORT || 8089);

console.log('i am up at 8089');
