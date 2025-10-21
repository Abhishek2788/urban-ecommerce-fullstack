const PORT = 4000;
const dotenv = require('dotenv');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

app.use(express.json());
app.use(cors());
// Load environment variables
dotenv.config();  // <-- this must come before using process.env

// Database Connection with Mongoose
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{console.log("Mongoose Connected Successfully!")})
    .catch((err)=>{console.log("Getting error "+err)});

// API Creation

app.get('/', (req, res)=>{
    res.send('Express is running smoothly!!')
})

// Image Storage Engine Using Multer

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req,file,cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({storage: storage})

//Endpoint for Uploading images
app.use('/images',express.static('upload/images'))

app.post('/upload',upload.single('product'),(req,res)=>{
    res.json({
        success: 1,
        image_url: `http://localhost:${PORT}/images/${req.file.filename}`
    })
})

// Schema for Creating Products

const Product = mongoose.model('Product',{
    id:{
        type: Number,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    new_price:{
        type: Number,
        required: true,
    },
    old_price:{
        type: Number,
        default: true,
    },
    date:{
        type: Date,
        default: Date.now,
    },
    available:{
        type: Boolean,
        default: true,
    },
})

app.post('/addproduct',async (req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length > 0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0]
        id=last_product.id+1
    }
    else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price
    })
    console.log(product);
    await product.save();
    console.log("Product Saved Successfully!!");
    res.json({
        success: true,
        name: req.body.name,
    })
})


// Creating API for deleting product

app.post('/removeproduct', async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Product Removed Successfully!!");
    res.json({
        success: true,
        name:req.body.name
    })
})

// API for getting all products from database

app.get('/allproducts', async (req,res)=>{
    let products = await Product.find({});
    console.log("All Products Fetched Successfully!!");
    res.send(products);
})


// Model Creation for Users:

const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

// Endpoint for Creating Users

app.post('/signup',async (req,res)=>{
    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:'existing user found with same email address'})
    }
    let cart = {};
    for(let i=0; i<300; i++){
        cart[i]=0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })
    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }
    const token = jwt.sign(data, process.env.JWT_SECRET);
    res.json({success:true,token})
})


// Creating endpoint for User Login
app.post('/login',async (req, res)=>{
    let user = await Users.findOne({email: req.body.email});
    if (user) {
        const passwordCompare = req.body.password === user.password;
        if(passwordCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data, process.env.JWT_SECRET);
            res.json({success:true, token});
        }
        else{
            res.json({success:false, errors:'You have Entered Wrong Passowrd!!'});;
        }
    }
    else{
        res.json({success:false, errors:'You have Entered Wrong Email Id!!'})
    }
})


// Creating endpoint for newcollection data

app.get('/newcollectiondata', async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("New Collection Fetched!!!");
    res.send(newcollection)
})

// Creating endpoint for popular in women section

app.get('/popularinwomen', async (req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular Women Fetched!!!");
    res.send(popular_in_women);
})


// Creating Middleware to fetch user

const fetchUser = async (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors: "Please authenticate using valid token!!"})
    }
    else{
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({errors:"Please authenticate using a valid token!!!"})
        }
    }
}

// Creating endpoint for adding items to cart

app.post('/addtocart',fetchUser,async (req,res)=>{
    // console.log(req.body,req.user);
    try {
        console.log("Added ",req.body.itemId);
        let userData = await Users.findOne({_id:req.user.id});
        userData.cartData[req.body.itemId] += 1;
        await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
        res.json({success: true, message: 'Data Added to Cart!!'})
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Server Error" });
    }
})

// Endpoint for removing product from Cart Data

app.post('/removefromcart',fetchUser,async (req,res)=>{
    try {
        console.log("Removed ",req.body.itemId);
        let userData = await Users.findOne({_id:req.user.id});
        if (userData.cartData[req.body.itemId]>0) {
            userData.cartData[req.body.itemId] -= 1;
            await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
            res.json({success: true, message: 'Data Removed from Cart!!'})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Server Error" });
    }
})

// Creating endpoint for showing user cart data from database

app.post('/getcart',fetchUser,async (req,res)=>{
    console.log("Get Cart!");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})

app.listen(PORT,(error)=>{
    if(!error){
        console.log(`Server is running at Port http://localhost:${PORT}`);
    }
    else{
        console.log(`Getting error: ${error}`);
    }
})

