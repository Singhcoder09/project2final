const express = require('express');
const path = require('path');
const routes = require('./routes/index');
//const routes1 = require('./routes/register');
const bodyParser = require('body-parser');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);
// 
//app.use('/', routes1);
app.use(express.static('public'));

module.exports = app;