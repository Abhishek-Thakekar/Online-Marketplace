const express = require('express')
const app = express()
// const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

// app.use(cors({credentials: true, origin: true}))
app.use(cookieParser())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


// connect database... useNewUrlParser to avoid deprecation warning...3rd argument is callback...
mongoose.connect('mongodb://localhost:27017/OnlineMarketplace' , {useNewUrlParser:true ,  useUnifiedTopology: true} , ()=>{
    console.log("database connected successfully");
}) 


// router
const userRouter = require('./routes/User');
app.use('/user' , userRouter);

// const shopRouter = require('./routes/Shop');
// app.use('/shop' , shopRouter);

// const bagRouter = require('./routes/Bag');
// app.use('/bag' , bagRouter);


// express server
app.listen(5000 , ()=>{
    console.log("Express server started");
})

