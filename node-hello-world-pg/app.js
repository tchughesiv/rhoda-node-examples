var { Client } = require('pg')
var serviceBindings = require('kube-service-bindings');

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var greetingRouter = require('./routes/greeting');
var app = express();

try {
    // check if the deployment has been bound to a pg instance through
    // service bindings. If so use that connect info
    pgConnectionBindings = serviceBindings.getBinding('POSTGRESQL', 'pg');
} catch (err) { // proper error handling here
};


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/greeting', greetingRouter);

module.exports = app;

start()

var client = new Client()
async function start() {
    await client.connect()
    var res = await client.query('SELECT $1::text as message', ['Hello world!'])
    console.log(res.rows[0].message) // Hello world!
    console.log(client.host)
    await client.end()
}