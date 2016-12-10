'use strict';

const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const home = require('./routes/home');

const app = express();

app.set('view engine', 'ejs');
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/', home);

module.exports = app;
