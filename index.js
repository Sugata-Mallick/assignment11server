const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId=require('mongodb').ObjectId
const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jxij5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
try{
    await client.connect();
    const database = client.db("tourism-way");
    const serviceCollection = database.collection("services");
    const orderCollection = database.collection("orders")

//GET API
app.get("/services", async(req, res) => {
    const cursor = serviceCollection.find({});
    const services = await cursor.toArray();
    res.send(services)
  });
  // GET SINGLE SERVICES
  app.get("/services/:id", async(req, res) => {
const id = req.params.id;
const query ={_id: ObjectId(id)};
const service = await serviceCollection.findOne(query)
res.json(service)
  })
//POST API
app.post('/services', async(req, res)=>{
    const service = req.body;
    console.log('hitted the post', service)

    const result = await serviceCollection.insertOne(service)
    console.log(result);
    res.json(result)
})
//DELETE API
app.delete('/dltOrders/:id', async(req, res)=>{
    const id = req.params.id;
    console.log(id)
    const query ={_id: ObjectId(id)};
    const results = await orderCollection.deleteOne(query)
    console.log(results)
    res.json(results)
})

//GET ANOTHER API
app.get("/orders", async(req, res) => {
  const cursor = orderCollection.find({});
  const orders = await cursor.toArray();
  res.send(orders)
});
//POST ANOTHER API
app.post('/addOrders', async(req, res)=>{
  const order = req.body;
  console.log('hitted the post', order)

  const result = await orderCollection.insertOne(order)
  console.log(result);
  res.json(result)
})

}
    finally {
      //  await client.close();
      }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log("hello", port);
});
