

// // order schemaa
// transaction : {
//     _id
//     product._id
//     user._id
//     quantity
//     date
//     payment type
//     address
//     isDelivered
//     isReceived
// }

const mongoose = require('mongoose');

var item = {

    productId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product',
        required : true
    },
    productName : {
        type : String,
        required : true
    },
    quantity : {
        type : Number,
        required : true
    },
    price : {
        type: Number,
        required : true
    },
    suggestion : {
        type : String
    }
}

const OrderSchema = new mongoose.Schema({

    items : [item],

    total: {
        type : Number,
        required : true
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    // quantity : {
    //     type : Number,
    //     required : true
    // },
    paymentType : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    isDelivered : {
        type : Boolean,
        default : false
    },
    isReceived : {
        type : Boolean,
        default : false
    },
    date : {
        type : Date,
        default : Date.now
    }
});

const Order = module.exports = mongoose.model('Order', OrderSchema);
