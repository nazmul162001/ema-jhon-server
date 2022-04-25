const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();


//middleware
app.use(express.json());
app.use(cors());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.06soh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try{
    await client.connect();
    const productCollection = client.db('emaJohn').collection('product');

    // get / read
    app.get('/product', async(req, res) => {

      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);

      console.log(page, size);
      
      const query = {};
      const cursor = productCollection.find(query);
      if(page || size){
        products = await cursor.skip(page*size).limit(size).toArray();
      }
      else{
        products = await cursor.toArray();
      }
      res.send(products)
    })


    // total product count for pagination
    app.get('/productCount', async(req, res) => {
      const count = await productCollection.estimatedDocumentCount();
      res.send({count})
    })

    //use post to get products by ids
    app.post('/productByKeys',async(req,res)=>{
      const keys = req.body;
      const ids = keys.map(id => ObjectId(id))
      const query = {_id: {$in: ids}}
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    })
    
    


  }
  finally{

  }
}
run().catch(console.dir);



// client.connect(err => {
//   const collection = client.db("emaJhon").collection("product");
//   // perform actions on the collection object
//   console.log('mongo is connected');
//   // client.close();
// });




app.get('/', (req, res) => {
  res.send('My John is running')
})

app.listen(port, () => {
  console.log('John is running on port', port);
})