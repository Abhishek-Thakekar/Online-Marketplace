const express = require('express');
const adminRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
// const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const fs = require('fs-extra');
const multer = require("multer");

let upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, callback) => {
        let productId = req.params.productId;
        let path = `./uploads/${productId}`;
        fs.mkdirsSync(path);
        callback(null, path);
      },
      filename: (req, file, callback) => {
        callback(null, file.originalname);
      }
    })
})

// Fetch data of products
adminRouter.get('/admin', passport.authenticate('jwt', { session: false }), (req, res) => {
    Product.find({}).exec((err, document) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
        }
        else {
            console.log("inside admin", document);
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
            else
                res.status(200).json({ message: { msgBody: "New Product has been added", msgError: false } });
        });
    }
});

// Edit product

// Fetch data
adminRouter.post('/getEditProduct', passport.authenticate('jwt', { session: false }), (req, res) => {
    const productId = req.body.productId;
    console.log("product id is ",req.body.productId);

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
adminRouter.post('/updateEditProduct/:productId',upload.array('myFile',10), passport.authenticate('jwt', { session: false }), (req, res) => {
    const product = req.body;
    const productId = req.body.productId;

    Product.findById({ _id: productId }).exec((err, document) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: { msgBody: "Couldn't edit product", msgError: true } });
        }
        if (document) {
            document.productName = product.productName;
            document.price = product.price;
            document.category = product.category;
            document.availability = product.availability;
            document.description = product.description;
            
            document.save(err =>{
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: { msgBody: "Couldn't edit product", msgError: true } });
                }
                res.status(200).json({ message: { msgBody: "Product info has been updated", msgError: false }, authenticated: true });
            });
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