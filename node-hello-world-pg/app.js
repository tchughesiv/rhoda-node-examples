const { Client } = require('pg')
const serviceBindings = require('kube-service-bindings');

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var greetingRouter = require('./routes/greeting');

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/greeting', greetingRouter);

module.exports = app;

try {
    // check if the deployment has been bound to a pg instance through
    // service bindings. If so use that connect info
    pgConnectionBindings = serviceBindings.getBinding('POSTGRESQL', 'pg');
} catch (err) { // proper error handling here
};

const client = new Client()

await client.connect()
const res = await client.query('SELECT $1::text as message', ['Hello world!'])
console.log(res.rows[0].message) // Hello world!
console.log(client.host)
await client.end()
