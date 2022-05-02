const express = require('express');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const app = express();
var MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const port = process.env.PORT || 5000;



//----Middleware---
app.use(cors());
app.use(express.json());





var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@vaccine77-shard-00-00.bmpdq.mongodb.net:27017,vaccine77-shard-00-01.bmpdq.mongodb.net:27017,vaccine77-shard-00-02.bmpdq.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-yz5qv3-shard-0&authSource=admin&retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function run() {

    try {

        await client.connect();
        const productCollection = client.db("vaccine").collection("item");
        // Get API

        app.get("/item", async (req, res) => {

            const query = {};
            const cursor = productCollection.find(query);
            const vaccine = await cursor.toArray();
            res.send(vaccine);
        });


        app.get("/item/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const vaccine = await productCollection.findOne(query);
            res.send(vaccine);
            console.log
        });
        app.post("/item", async (req, res) => {
            const newVaccine = req.body;
            const result = await productCollection.insertOne(newVaccine);
            res.send(result);
        });

        // delete Api
        app.delete("/item/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        });







    } finally { }

}
run().catch(console.dir);












app.get('/', (req, res) => {
    res.send('Vaccine giving')
})

app.listen(port, () => {
    console.log('running port', port)
})





