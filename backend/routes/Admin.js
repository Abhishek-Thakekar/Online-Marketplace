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

const commandForQuery = ["C:\\Users\\Admin\\anaconda3\\Scripts\\activate && python F:\\Online-Marketplace\\img_searcg\\main.py --action input --imPath F:\\Online-Marketplace\\frontend\\public\\uploads\\"]


let count = 0;

let upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            let productId = req.params.productId;
            let path = `../frontend/public/uploads/${productId}`;
            fs.mkdirsSync(path);
            callback(null, path);
        },
        filename: (req, file, callback) => {

            callback(null, String(count++) + "." + 'jpg');
        }
    })
})

const addImgToHashTable = (productId) => {
    const {exec} = require('child_process');
    const dirPath = "F:\\Online-Marketplace\\frontend\\public\\uploads\\" + productId;
    

    files = fs.readdirSync(dirPath);
    let count = 1;

    files.forEach(function(file){
        let command = commandForQuery[0] + productId + "\\" + file + " --pKey " + productId + "_" + count;
        count++;
        exec(command,(error, stdout, stderr) => {
            console.log("exec");
            if (error) {
                console.log("error", error);
                res.status(500).json({ message: { msgBody: error, msgError: true } });
            }
            if (stderr) {
                console.log("Stderr",stderr);
                res.status(500).json({ message: { msgBody: stderr, msgError: true } });
            }
            console.log(file, command);
        });
    });

    
}
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
    console.log("product id is getedit=>", req.body.productId);
    if (!productId) {
        console.log("ProductId is not defined");
        res.status(500).json({ message: { msgBody: "Something Went Wrong!", msgError: true } });
    } else {

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
    }
});


// Update data
adminRouter.post('/updateEditProduct/:productId', upload.array('myFile', 10), passport.authenticate('jwt', { session: false }), (req, res) => {
    const product = req.body;
    const productId = req.body.productId;

    addImgToHashTable(productId);
    
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

            document.save(err => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: { msgBody: "Couldn't edit product", msgError: true } });
                }
                count = 1;
                res.status(200).json({ message: { msgBody: "Product edited ", msgError: true } });
            });
        }
        else
            res.status(500).json({ message: { msgBody: "No such product found ", msgError: true } });
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

// Get orders from customers
adminRouter.get('/admin_orders', passport.authenticate('jwt', { session: false }), (req, res) => {
    Order.find({}).exec((err, document) => {
        if (err)
            res.status(500).json({ message: { msgBody: "Error in showing your orders !!!", msgError: true } });
        else {
            res.status(200).json({ data: document, authenticated: true });
        }
    });
});


adminRouter.post('/isDelivered', passport.authenticate('jwt', { session: false }), (req, res) => {

    const orderId = req.body.orderId;
    Order.findById({ _id: orderId }).exec((err , document) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: { msgBody: "Error has occured. Try again.", msgError: true } });
        }
        else {
            document.isDelivered = "true";
            document.save(err => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: { msgBody: "Error has occured.", msgError: true } });
                }
                res.status(200).json({ message: { msgBody: "Order has been delivered", msgError: false }, authenticated: true });
            });
            
        }
    });
});



module.exports = adminRouter;