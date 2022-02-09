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

const { MongoClient } = require('mongodb')
var serviceBindings = require('kube-service-bindings');
var ConnectionOptions = {
    user: 'user',
    host: 'host',
    password: 'password',
    port: 'port',
    srv: 'srv'
}

try {
    // check if the deployment has been bound to a pg instance through
    // service bindings. If so use that connect info
    ConnectionOptions = serviceBindings.getBinding('MONGODB', 'mongodb');
} catch (err) { // proper error handling here
};

var password = encodeURIComponent(ConnectionOptions.password)
var connectString = ConnectionOptions.user+':'+password+'@'+ConnectionOptions.host
var url = 'mongodb://'+connectString+':'+ConnectionOptions.port;
if (ConnectionOptions.srv === 'true') {
    url = 'mongodb+srv://'+connectString;
}

const client = new MongoClient(url)

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  
  //const db = client.db(dbName);
  //const collection = db.collection('documents');

  // the following code examples can be pasted here...

  return 'done.';
}

main()
.then(console.log)
.catch(console.error)
.finally(() => client.close());