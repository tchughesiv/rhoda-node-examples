const { Client } = require('pg')
var serviceBindings = require('kube-service-bindings');

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var greetingRouter = require('./routes/greeting');
var app = express();
var ConnectionOptions = {
    user: 'user',
    host: 'host',
    database: 'database',
    password: 'password',
    port: 'port',
}

try {
    // check if the deployment has been bound to a pg instance through
    // service bindings. If so use that connect info
    ConnectionOptions = serviceBindings.getBinding('POSTGRESQL', 'pg');
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

console.log(ConnectionOptions)
const client = new Client({
    host: ConnectionOptions.host,
    port: ConnectionOptions.port,
    database: ConnectionOptions.database,
    user: ConnectionOptions.username,
    password: ConnectionOptions.password,
    ssl: {
        rejectUnauthorized: false,
    },
})
start()

async function start() {
    await client.connect()
    var res = await client.query('SELECT $1::text as message', ['Hello world!'])
    console.log(res.rows[0].message) // Hello world!
    console.log(client.host)
    await client.end()
}