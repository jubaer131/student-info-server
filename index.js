const express = require('express')
const cors =require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000

// midleware 
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_INFO}:${process.env.DB_PASSWORD}@cluster0.8dssgfd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeeCollection31 = client.db("teaDB").collection("tea");



    app.get('/coffee', async(req,res)=>{
        const cursor = coffeeCollection31.find();
        const result = await cursor.toArray();
        res.send(result)
      })
      app.get('/updateinfo/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await coffeeCollection31.findOne(query);
        res.send(result);
    })

    app.post('/coffee', async(req, res) => {
        const newCoffee =req.body ;
        console.log('coffee', newCoffee)
        const result = await coffeeCollection31.insertOne(newCoffee);
        res.send(result)
      })

      app.put('/coffee/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) }
        const options = { upsert: true };
        const updatedCoffee = req.body;

        const coffee = {
            $set: {
                name: updatedCoffee.name,
                quantity: updatedCoffee.quantity,
                supplier: updatedCoffee.supplier,
                taste: updatedCoffee.taste,
                category: updatedCoffee.category,
                details: updatedCoffee.details,
                photo: updatedCoffee.photo
            }
        }

        const result = await coffeeCollection31.updateOne(filter, coffee, options);
        res.send(result);
    })
      app.delete('/delete/:id', async (req, res) => {
        const id = req.params.id;
        console.log('Deleting from database:', id);
        const query = { _id: new ObjectId(id) };
        const result2 = await coffeeCollection31.deleteOne(query);
        res.send(result2)
      })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('student info is running here')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})