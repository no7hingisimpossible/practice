const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m6aha.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        client.connect()
        const inventoryCollection = client.db('inventory').collection('inventories')
        const orderCollection = client.db('inventory').collection('orders')
        console.log('db connected');

        app.get("/inventories", async (req, res) => {
            const query = {}
            const cursor = inventoryCollection.find(query)
            const inventory = await cursor.toArray()
            res.send(inventory)

        })

        app.get('/inventories/:id', async (req, res) => {
            const {id} = req.params;
            const query = { _id: ObjectId(id) }
            const result = await inventoryCollection.findOne(query)
            res.send(result);
        })

        app.put('/inventories/:id', async (req, res) => {
            const {id} = req.params;
            const newQty = req.body
            console.log(newQty);
            console.log(req.body.newQty);
            const filter = { _id: ObjectId(id) }
            console.log(filter);
            const options = { upsert: true };
            const updateQty = {
                $set: {
                    qty: newQty.newQty
                },
            };
            const result = await inventoryCollection.updateOne(filter, updateQty, options);
            res.send(result)
        })

        app.post('/inventories', async(req, res) => {
            const addedItem = req.body 
            console.log(addedItem); 
            const result = await inventoryCollection.insertOne(addedItem)
            res.send(result)
        })

        app.get('/inventory', async(req, res)=> {
            const email = req.query.email;
            const query = {email: email};
            console.log(query);
            const cursor = inventoryCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
            
        })
        app.delete('/inventory/:id', async(req, res)=>{
            const id = req.params;
            const query = {_id: ObjectId(id)}
            console.log(id);
            const result = await inventoryCollection.deleteOne(query)
            res.send(result)
        })

        app.delete('/inventories/:id', async(req, res)=>{
            const id = req.params;
            const query = {_id: ObjectId(id)}
            console.log(id);
            const result = await inventoryCollection.deleteOne(query)
            res.send(result)
        })

        // app.post('/orders', async(req, res) => {
        //     const orders = req.body 
        //     console.log(orders);
        //     const result = await orderCollection.insertOne(orders)
        //     res.send(result)
        // })
        // // app.get('/orders', async(req, res) => {
        // //     const email = req.query.email;
           
        // //     const query = {email: email};
        // //     const cursor = orderCollection.find(query);
        // //     const orders = await cursor.toArray();
        // //     res.send(orders);
            

        // })
    }

    finally {
        //   await client.close();
    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send('Hello World')
})
app.listen(port, () => {
    console.log("listening to port", port);
})