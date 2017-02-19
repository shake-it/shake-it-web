var express = require('express');

var app = express();

app.use(express.static('static'));

app.listen(3000, '192.168.199.93');
console.log('Server listening on port 3000', '192.168.199.93');