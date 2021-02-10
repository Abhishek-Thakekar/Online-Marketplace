// // product schema
// _id
// productName
// price
// categoryName or shopName
// sold
// availability
// transactions => [transaction._id] 
// date

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    productName : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    sold : {
        type : Number,
        default : 0
    },
    availability : {
        type : Number,
        required : true
    },
    description :{
        type : String
    },
    transactions : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Order'
    }],
    date : {
        type : Date,
        default : Date.now
    }
});

const Product = module.exports = mongoose.model('Product', ProductSchema);