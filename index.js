const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const app = express();
var MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const port = process.env.PORT || 5000;

//----Middleware---
app.use(cors());
app.use(express.json());



//------------JWT Token Function---------
function token(req, res, next) {
    const headerAuth = req.headers.authorization;
    if (!headerAuth) {
        return res.status(401).send({ message: "Sorry! Access Denied" });
    }
    const jwtToken = headerAuth.split(' ')[1];
    jwt.verify(jwtToken, process.env.JWT_TOKEN, (err, decoded) => {

        if (err) {
            return res.status(403).send({ message: "Sorry! Forbidden Access" });
        }
        req.decoded = decoded;
        next()
    })

}


var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@vaccine77-shard-00-00.bmpdq.mongodb.net:27017,vaccine77-shard-00-01.bmpdq.mongodb.net:27017,vaccine77-shard-00-02.bmpdq.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-yz5qv3-shard-0&authSource=admin&retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function run() {

    try {

        await client.connect();
        const vaccineCollection = client.db("vaccine").collection("item");


        //------------login with JWT---------
        app.post('/login', async (req, res) => {
            const user = req.body
            const tokenAccess = jwt.sign(user, process.env.JWT_TOKEN, {
                expiresIn: '2d'
            });
            res.send({ tokenAccess });

        });



        // ----------Get API----------
        app.get("/item", async (req, res) => {

            const query = {};
            const cursor = vaccineCollection.find(query);
            const vaccine = await cursor.toArray();
            res.send(vaccine);
        });


        app.get("/item/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const vaccine = await vaccineCollection.findOne(query);
            res.send(vaccine);

        });
        app.post("/item", async (req, res) => {
            const newVaccine = req.body;
            const result = await vaccineCollection.insertOne(newVaccine);
            res.send(result);
        });

        // ----------Delete API----------
        app.delete("/item/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await vaccineCollection.deleteOne(query);
            res.send(result);
        });



        //------------my Item with JWT---------
        app.get("/myitem", token, async (req, res) => {
            const emailDecoded = req.decoded.email;
            const email = req.query.email;
            if (emailDecoded === email) {
                const query = { email: email };
                const cursor = vaccineCollection.find(query);
                const vaccine = await cursor.toArray();
                res.send(vaccine);
            }
            else {
                return res.status(403).send({ message: "Sorry! Forbidden Access" });
            }
        });



        //------------update user quantity------------------
        app.put("/item/:id", async (req, res) => {
            const id = req.params.id;
            const updateVaccine = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateData = {
                $set: {
                    quantity: updateVaccine.quantity,
                },
            };
            const result = await vaccineCollection.updateOne(
                filter,
                updateData,
                options
            );
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





