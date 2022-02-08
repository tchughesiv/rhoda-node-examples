import { Client } from 'pg';
var client = new Client()
import { getBinding } from 'kube-service-bindings';

import express, { json, urlencoded, static } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';
import greetingRouter from './routes/greeting';
var app = express();

try {
    // check if the deployment has been bound to a pg instance through
    // service bindings. If so use that connect info
    pgConnectionBindings = getBinding('POSTGRESQL', 'pg');
} catch (err) { // proper error handling here
};

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(static(join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/greeting', greetingRouter);

export default app;

start()

async function start() {
    await client.connect()
    var res = await client.query('SELECT $1::text as message', ['Hello world!'])
    console.log(res.rows[0].message) // Hello world!
    console.log(client.host)
    await client.end()
}