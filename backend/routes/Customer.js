const express = require('express');
const customerRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');


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
customerRouter.get('/cart', passport.authenticate('jwt', { session: false }),async (req, res) => {
    // User.findById({_id : req.user._id}).exec((err, document) => {
    //     if (err) {
    //         console.log(err);
    //         res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
    //     }
    let data = [];
    await req.user.carts.map(async element => {
        await Product.findById({ _id: element.productId }).exec((error, doc) => {
            if (error) {
                console.log(err);
                res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
            }
            let obj = {
                quantity: element.quantity,
                suggestion: element.suggestion,
                product: doc
            }
            // console.log("obj : ", obj);
            data.push(obj);
            console.log("data", data);
        });
    });
    console.log(data);
    res.status(200).json({ data: data });

});



// post products to cart
customerRouter.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    let item = req.body.item;
    // User.findById({ _id: req.user._id }).exec((err, document) => {
    //     if (err) {
    //         console.log(err);
    //         res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
    //     }
    req.user.carts.push(item);
    req.user.save(err => {
        if (err)
            res.status(500).json({ message: { msgBody: "Error has occured in adding item inside bag", msgError: true } });
        else
            res.status(200).json({ message: { msgBody: "Product added to cart", msgError: false } });

    })
    // });
});

// modify cart
customerRouter.post('/cart', passport.authenticate('jwt', { session: false }), (req, res) => {
    let item = req.body.item;
    // User.findById({ _id: req.user._id }).exec((err, document) => {
    //     if (err) {
    //         console.log(err);
    //         res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
    //     }
    if (item.quantity === 0) {
        req.user.carts.filter(ele => ele.productId !== item.productId);
    } else {
        let old = req.user.carts.find(ele => ele.productId === item.productId);
        old = item;
    }

    req.user.save(err => {
        if (err)
            res.status(500).json({ message: { msgBody: "Error has occured in updating items inside bag", msgError: true } });
        else
            res.status(201).json({ message: { msgBody: "Bag has been updated", msgError: false } });
    })
    // });
});

// orders =>>>>>>>>>>
// get placed orders
customerRouter.get('/myorders', passport.authenticate('jwt', { session: false }), (req, res) => {

});

// post place order
customerRouter.post('/myorders', passport.authenticate('jwt', { session: false }), (req, res) => {

});



module.exports = customerRouter;