let express = require('express');
let app = express();
let port = process.env.PORT||4545;
let Mongo = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
let {dbConnect,getData,postData,updateOrder,deleteOrder} = require('./controller/dbController')


/// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())
 
app.get('/',(req,res) => {
    res.send('Hi from express')
})

/// all location 

app.get('/location',async (req,res) => {
    let query = {}
    if(req.query.stateId){
        query={state_id: Number(req.query.stateId)}
    }
    else{
        query = {}
    }
    let collection = "location"
    let output = await getData(collection,query) 
    res.send(output)
})


/// all menutypes                   

app.get('/MenuType', async (req,res) => {
    let query = {};
    if(req.query.menuId){
        query={MenuType_id: Number(req.query.menuId)}
    }
    else{
        query = {}
    }
    let collection = "MenuType";
    let output = await getData(collection,query);
    res.send(output)
})

app.get('/wedOffer', async(req,res) => {
    let query = {}
    let collection = 'wedOffer'
    let output = await getData(collection,query)
    res.send(output)
})


app.get('/boxMeal', async (req,res) => {
    let query = {}
    let collection = 'boxMeal'
    let output = await getData(collection,query)
    res.send(output)
})

/// orders

app.get('/orders', async (req,res) => {
    let query = {};
    if(req.query.email){
        query={email:req.query.email}
    }
    else{
        query = {}
    }
    let collection = "orders";
    let output = await getData(collection,query);
    res.send(output)
})

/// placeOrders

app.post('/placeOrder',async(req,res) => {
    let data = req.body;
    let collection = "orders";
    let response = await postData(collection,data)
    res.send(response)
})


//menu details

app.post('/menuDetails',async(req,res) => {
    if(Array.isArray(req.body.id)){
        let query = {menu_id:{$in:req.body.id}};
        let collection = 'menu';
        let output = await getData(collection,query);
        res.send(output)
    }
    else {
        res.send('Please Pass data  in form of array')
    }
})


/// update orders

app.put('/updateOrder',async(req,res) => {
    let collection = 'orders';
    let condition = {"_id":new Mongo.ObjectId(req.body._id)}
    let data = {
        $set:{
            "status":req.body.status
        }
    }
    let output = await updateOrder(collection,condition,data)
    res.send(output)
})

/// delete orders

app.delete('/deleteOrder',async(req,res) => {
    let collection = 'orders';
    let condition = {"_id":new Mongo.ObjectId(req.body._id)}
    let output = await deleteOrder(collection,condition)
    res.send(output)
})

app.listen(port,(err) => {
    dbConnect()
    if(err) throw err;
    console.log(`Server is running on port ${port}`)
})