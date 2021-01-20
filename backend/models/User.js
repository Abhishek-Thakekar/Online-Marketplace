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

var cart = {
    quantity: {
        type: Number,
        default: 1
    },
    suggestion :{
        type : String,
    },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }

}

const UserSchema = new mongoose.Schema({
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
        default: "blank.jpg"
    },

    role: {
        type: String,
        default: "user"
    },

    address: {
        type: String,
        required: true
    },

    carts: [cart],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]

});


UserSchema.pre('save', function (next) {
    if (!this.isModified('password'))
        return next();
    bcrypt.hash(this.password, 10, (err, passwordHash) => {
        if (err)
            return next(err);
        this.password = passwordHash;
        next();
    });
});

UserSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err)
            return cb(err);
        else {
            if (!isMatch)
                return cb(null, isMatch);
            return cb(null, this);
        }
    });
}

module.exports = mongoose.model('User', UserSchema);




