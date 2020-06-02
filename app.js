const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');

var token = require('./routes/token-route'); 
// var routes = require('./routes');
var app = express();

app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', token.mainPage);
app.post('/token/add', token.add);
app.post('/token/addToken', token.addToken);
app.post('/token/cancel',token.cancel);
app.post('/token/cancelToken',token.cancelToken);
app.post("/token/change",token.change);
app.post("/token/changeToken",token.changeToken);

app.listen(5000, function () {
    console.log('Server is running.. on Port 5000');
});