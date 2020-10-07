const request = require("request");
const express = require('express');
const cors = require('cors');
const mysql = require('mysql')
const searchYoutube = require('youtube-api-v3-search');
const dotenv = require('dotenv').config();
const app = express();

var userRouter = require('./routes/user')
var searchRouter = require('./routes/search')
var eventRouter = require('./routes/event')

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect(function (err) {
    (err) ? console.log(err) : console.log('connection')
});

//Prevent server from timing out
setInterval(function () {
    connection.query('SELECT 1', [], function () { })
}, 500000);

app.use(cors());

app.listen(15416, () => {
    console.log('Connection established')
});