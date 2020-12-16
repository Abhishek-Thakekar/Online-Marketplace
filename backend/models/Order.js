

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

const OrderSchema = new mongoose.Schema({
    productId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product',
        required : true
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    quantity : {
        type : Number,
        required : true
    },
    paymentType : {
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
