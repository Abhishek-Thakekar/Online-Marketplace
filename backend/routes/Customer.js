const express = require('express');
const customerRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Razorpay = require('razorpay');
const shortid = require('shortid');


// get products to home
customerRouter.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    Product.find({}).exec((err, document) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
        }
        else {
            res.status(200).json({ products: document, authenticated: true });
        }
    });
});


// cart=>>>>>>>>>
// get products to cart
customerRouter.get('/cart', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findById({ _id: req.user._id }).populate('carts.productId').exec((err, document) => {
        if (err) {
            // console.log("hi 1");
            console.log(err);
            // console.log("hi 2");
            res.status(500).json({ message: { msgBody: "Error has occured !!!", msgError: true } });
        }
        else {
            // console.log("carts => ",document.carts);
            res.status(200).json({ data: document.carts, authenticated: true });
        }
    });

});



// post products to cart
customerRouter.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    let item = req.body.item;
    // User.findById({ _id: req.user._id }).exec((err, document) => {
    //     if (err) {
    //         console.log(err);
    //         res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
    //     }
    let temp=null;
    if (req.user.carts) {
        temp = req.user.carts.find(element => {
            // console.log(typeof(element.productId) + " && " + typeof(item.productId));
            // if(element.productId == item.productId)
            //     console.log("true");
            // else   
            //     console.log("false");
            return element.productId == item.productId;
        });
    }
    if (temp)
        res.status(200).json({ message: { msgBody: "Item is already in cart.", msgError: false } });
    else {
        req.user.carts.push(item);
        req.user.save(err => {
            if (err)
                res.status(500).json({ message: { msgBody: "Error has occured in adding item inside bag", msgError: true } });
            else
                res.status(200).json({ message: { msgBody: "Product added to cart", msgError: false } });

        });
    }
    // });
});

// modify cart
customerRouter.post('/cart', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let item = req.body.item;
    // console.log("item : ",item);
    // User.findById({ _id: req.user._id }).exec((err, document) => {
    //     if (err) {
    //         console.log(err);
    //         res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
    //     }
    if (item.quantity === 0) {
        console.log("removing...");
        // req.user.carts.pull({productId : item.productId._id});
        await req.user.carts.filter(element => {
            console.log(typeof (String(element.productId)) + " && " + typeof (item.productId._id));
            console.log(element.productId + " && " + item.productId._id);
            console.log(String(element.productId) === item.productId._id);
            return String(element.productId) !== item.productId._id;
        });
    } else {
        let temp = req.user.carts.find(element => {
            console.log(typeof (element.productId) + " && " + typeof (item.productId._id));
            console.log((element.productId) + " && " + (item.productId._id));
            if (element.productId == item.productId._id)
                console.log("true");
            else
                console.log("false");
            return element.productId == item.productId._id;
        }); if (!temp)
            res.status(500).json({ message: { msgBody: "Error has occured in updating items inside bag", msgError: true } });
        else {
            temp.quantity = item.quantity;
            temp.suggestion = item.suggestion;
        }

    }
    req.user.save(err => {
        console.log("check ", req.user.carts);
        if (err)
            res.status(500).json({ message: { msgBody: "Error has occured in updating items inside bag", msgError: true } });
        else
            res.status(201).json({ message: { msgBody: "Bag has been updated", msgError: false } });
    });

});

// orders =>>>>>>>>>>
// get placed orders
customerRouter.get('/myorders', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findById({ _id: req.user._id }).populate('orders').exec((err, document) => {
        if (err)
            res.status(500).json({ message: { msgBody: "Error in showing your orders !!!", msgError: true } });
        else
            res.status(200).json({ data: document.orders, authenticated: true });
    });
});

// post place order
customerRouter.post('/myorders', passport.authenticate('jwt', { session: false }), (req, res) => {
    let order = req.body.transData;
    console.log("order => ", order);
    const newOrder = new Order(order);
    newOrder.save(err => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: { msgBody: "Couldn't place order", msgError: true } });
        }
        else {
            req.user.orders.push(newOrder);
            req.user.carts = [];
            req.user.save(err => {
                if (err)
                    res.status(500).json({ message: { msgBody: "Error has occured in placing order", msgError: true } });
                else
                    res.status(201).json({ message: { msgBody: "Order has been placed", msgError: false } });
            });
        }
    });
});


customerRouter.post('/razorpay', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const razorpay = new Razorpay({
        key_id: "rzp_test_wZA3hIzuwQPK0P",
        key_secret: "OeEUX3XfZa2VOxO260lkz0s9"
    });

    console.log("/razorpay working and total is", req.body);
    const amt = Number(req.body.total);
    const currency = 'INR';
    const payment_capture = 1;

    const options = {
        amount: (amt * 100).toString(),
        currency,
        receipt: shortid.generate(),
        payment_capture
    };
    try {
        const response = await razorpay.orders.create(options);
        console.log("response : ", response);
        res.status(200).json({ response: response, message: { msgBody: "Razorpay Payment !!!", msgError: false } });
    } catch (err) {
        console.log(err);
        res.status(500).json({ mybags: doc.mybags, message: { msgBody: "Something went wrong! Try again", msgError: false } });
    }


});





module.exports = customerRouter;