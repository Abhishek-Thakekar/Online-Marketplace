// // user schema
// _id
// username
// email
// password
// profileImage
// role
// firstname
// lastname
// address
// cart
// transactions => [transaction._id] 
// date


const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var user = new mongoose.Schema({
    username: {
        type: String,
        required: true
    }, 
    
    email: {
        type: String,
        required: true
    }, 
    
    password: {
        type: String,
        required: true
    },

    firstname: {
        type: String,
        required: true
    },

    lastname: {
        type: String,
        required: true
    },

    profile: {
        type: String,
        default :"blank.jpg"
    },

    role: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] ,
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }] 

});




