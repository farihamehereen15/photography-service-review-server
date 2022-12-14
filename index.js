const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const { query } = require('express');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

//middleware

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6vjtu3h.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('photography').collection('services');


        app.get('/homeservices', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query).limit(3);
            const services = await cursor.toArray();
            res.send(services);

        })

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);

        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { service_id: id };
            const service = await serviceCollection.findOne(query);
            res.send(service);

        })

        const reviewCollection = client.db("photography").collection("review");
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { service_id: id };
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)

        })

        //myreview get

        app.get('/review', async (req, res) => {
            console.log(req.query)
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);
        })

        //review post 
        app.post('/review', async (req, res) => {
            // const id = req.params.id
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result)
        })

        //service add

        app.post('/service', async (req, res) => {
            // const id = req.params.id
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })







    }
    finally {

    }
}

run().catch(err => console.error(err))



app.get('/', (req, res) => {
    res.send('Wings Photography')
})

app.listen(port, () => {
    console.log(`Wings Photography app listening on port ${port}`)
})