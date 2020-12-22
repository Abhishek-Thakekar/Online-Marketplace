const express = require('express');
const adminRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');


// Fetch data of products
adminRouter.get('/admin', passport.authenticate('jwt', { session: false }), (req, res) => {
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


// Add product
adminRouter.post('/addProduct', passport.authenticate('jwt', { session: false }), (req, res) => {
    const product = req.body;
    const newProduct = new Product(product);

    if (req.user.role === 'admin') {
        newProduct.save(err => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: { msgBody: "Couldn't add product", msgError: true } });
            }
        });
    }
});

// Edit product

// Fetch data
adminRouter.post('/getEditProduct', passport.authenticate('jwt', { session: false }), (req, res) => {
    const productId = req.body.productId;
    Product.findById({ _id: productId }).exec((err, document) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: { msgBody: "Couldn't edit product", msgError: true } });
        }
        if (document) {
            res.status(200).json({ product: document, authenticated: true });
        }
        else
            res.status(500).json({ message: { msgBody: "No such product found", msgError: true } });
    });
});


// Update data
adminRouter.post('/updateEditProduct', passport.authenticate('jwt', { session: false }), (req, res) => {

    const productId = req.body.productId;
    const product = req.body.product;

    Product.findById({ _id: productId }).exec((err, document) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: { msgBody: "Couldn't edit product", msgError: true } });
        }
        if (document) {
            document.name = product.name;
            document.price = product.price;
            document.category = product.category;
            document.availability = product.availability;
            res.status(200).json({ message: { msgBody: "Product info has been updated", msgError: false }, authenticated: true });
        }
        else
            res.status(500).json({ message: { msgBody: "No such product found", msgError: true } });
    });
});

// Delete product
adminRouter.post('/deleteProduct', passport.authenticate('jwt', { session: false }), (req, res) => {

    const productId = req.body.productId;
    Product.findByIdAndRemove({ _id: productId }).exec((err) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
        }
        else {
            res.status(200).json({ message: { msgBody: "Product has been deleted", msgError: false } });
        }
    });
});

module.exports = adminRouter;