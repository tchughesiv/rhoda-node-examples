// based on tutorial - https://docs.mongodb.com/drivers/node/current/fundamentals/time-series/

const { MongoClient, Db, Collection } = require('mongodb')
var serviceBindings = require('kube-service-bindings');

var DB = process.env.DB || 'time-series';
var COLLECTION = process.env.COLLECTION || 'weather';

let bindings;
try {
    // check if the deployment has been bound to a pg instance through
    // service bindings. If so use that connect info
    bindings = serviceBindings.getBinding('MONGODB', 'mongodb');
} catch (err) { // proper error handling here
};

async function main() {
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/drivers/node/ for more details
     */
    const url = bindings.url + '?retryWrites=true&w=majority';
    
    /**
     * The Mongo Client you will use to interact with your database
     * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
     * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
     * pass option { useUnifiedTopology: true } to the MongoClient constructor.
     * const client =  new MongoClient(uri, {useUnifiedTopology: true})
     */
    const client = new MongoClient(url, bindings.connectionOptions);

    //    try {
    
    // Connect to the MongoDB cluster
    await client.connect();
    console.log('Connected successfully to server');

    // Make the appropriate DB calls
    let database = client.db(DB)
    await createCollection(database)

    let collection = database.collection(COLLECTION)
    await insertRecords(collection)

     let aggregate = collection.aggregate( [
        {
           $project: {
              date: {
                 $dateToParts: { date: "$timestamp" }
              },
              temp: 1
           }
        },
        {
           $group: {
              _id: {
                 date: {
                    year: "$date.year",
                    month: "$date.month",
                    day: "$date.day"
                 }
              },
              avgTmp: { $avg: "$temp" }
           }
        }
     ] )

     console.log('')
     console.log(aggregate)
     
//    } finally {
//        // Close the connection to the MongoDB cluster
//        await client.close();
//    }
}

async function createCollection(database = new Db) {
    const collections = await database.collections();
    let exists = !collections.some(
        (collection) => collection.COLLECTION === COLLECTION
    )
    if (!exists) {
        database.createCollection(
            COLLECTION,
            {
                timeseries: {
                    timeField: "timestamp",
                    metaField: "metadata",
                    granularity: "hours"
                }
            }
        )
    }
}

async function insertRecords(collection = new Collection) {
    await collection.insertMany( [
        {
           "metadata": { "sensorId": 5578, "type": "temperature" },
           "timestamp": ISOdate("2021-05-18T00:00:00.000Z"),
           "temp": 12
        },
        {
           "metadata": { "sensorId": 5578, "type": "temperature" },
           "timestamp": ISOdate("2021-05-18T04:00:00.000Z"),
           "temp": 11
        },
        {
           "metadata": { "sensorId": 5578, "type": "temperature" },
           "timestamp": ISOdate("2021-05-18T08:00:00.000Z"),
           "temp": 11
        },
        {
           "metadata": { "sensorId": 5578, "type": "temperature" },
           "timestamp": ISOdate("2021-05-18T12:00:00.000Z"),
           "temp": 12
        },
        {
           "metadata": { "sensorId": 5578, "type": "temperature" },
           "timestamp": ISOdate("2021-05-18T16:00:00.000Z"),
           "temp": 16
        },
        {
           "metadata": { "sensorId": 5578, "type": "temperature" },
           "timestamp": ISOdate("2021-05-18T20:00:00.000Z"),
           "temp": 15
        }, {
           "metadata": { "sensorId": 5578, "type": "temperature" },
           "timestamp": ISOdate("2021-05-19T00:00:00.000Z"),
           "temp": 13
        },
        {
           "metadata": { "sensorId": 5578, "type": "temperature" },
           "timestamp": ISOdate("2021-05-19T04:00:00.000Z"),
           "temp": 12
        },
        {
           "metadata": { "sensorId": 5578, "type": "temperature" },
           "timestamp": ISOdate("2021-05-19T08:00:00.000Z"),
           "temp": 11
        },
        {
           "metadata": { "sensorId": 5578, "type": "temperature" },
           "timestamp": ISOdate("2021-05-19T12:00:00.000Z"),
           "temp": 12
        },
        {
           "metadata": { "sensorId": 5578, "type": "temperature" },
           "timestamp": ISOdate("2021-05-19T16:00:00.000Z"),
           "temp": 17
        },
        {
           "metadata": { "sensorId": 5578, "type": "temperature" },
           "timestamp": ISOdate("2021-05-19T20:00:00.000Z"),
           "temp": 12
        }
     ] )
}

function ISOdate(datetime = '') {
    return new Date(datetime).toISOString()
}

main().catch(console.error);

// Add functions that make DB calls here
