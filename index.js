
const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const cors = require('cors')


require('dotenv').config()



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gqi99.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 5000


app.get('/',(req,res)=>{
  res.send("db server working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const products = client.db("emajohnStore").collection("products");
  const ordersCollcection = client.db("emajohnStore").collection("orders");
  // perform actions on the collection object
  app.post('/addproduct',(req,res) =>{
      const product = req.body
     // console.log(product)
      products.insertMany(product)
      .then(result =>{
          console.log(result.insertedCount)
          res.send(result.insertedCount);
        
      })
        
  })



app.get('/products',(req,res) =>{
  products.find({})
  .toArray((err,documents)=>{
    res.send(documents)
  })
})

app.get('/product/:key',(req,res) =>{
  products.find({key:req.params.key})
  .toArray((err,documents)=>{
    res.send(documents[0])
  })
})


app.post('/productsbykeys',(req,res)=>{
    const productKeys = req.body
    products.find({key:{$in:productKeys}})
    .toArray((err,documents)=>{
      res.send(documents)
    })

})


app.post('/addorder',(req,res) =>{
  const order = req.body
 // console.log(product)
  ordersCollcection.insertOne(order)
  .then(result =>{
      
      res.send(result.insertedCount>0);
    
  })
    
})





});



app.listen(process.env.PORT || port)
