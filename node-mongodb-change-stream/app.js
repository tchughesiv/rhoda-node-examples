const { MongoClient } = require('mongodb')
var serviceBindings = require('kube-service-bindings');
var ConnectionOptions = {
    user: 'user',
    host: 'host',
    password: 'password',
    port: 'port',
    srv: 'srv'
}

var database = 'test'
var dbcollection = 'inventory'

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

async function main() {
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/drivers/node/ for more details
     */
    const uri = url+"/"+database+"?retryWrites=true&w=majority";
    
    /**
     * The Mongo Client you will use to interact with your database
     * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
     * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
     * pass option { useUnifiedTopology: true } to the MongoClient constructor.
     * const client =  new MongoClient(uri, {useUnifiedTopology: true})
     */
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log('Connected successfully to server');

        // Make the appropriate DB calls
        await monitorListingsUsingEventEmitter(client);

    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

function closeChangeStream(timeInMs = 60000, changeStream) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Closing the change stream");
            changeStream.close();
            resolve();
        }, timeInMs)
    })
}

async function monitorListingsUsingEventEmitter(client, timeInMs = 60000, pipeline = []){  
    const collection = client.db(database).collection(dbcollection);
    const changeStream = collection.watch(pipeline);

    changeStream.on('change', (next) => {
        console.log(next);  
   });

   await closeChangeStream(timeInMs, changeStream);
}

main().catch(console.error);

// Add functions that make DB calls here
