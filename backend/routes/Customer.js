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
const fs = require('fs-extra');
const multer = require("multer");

let upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            let path = `../frontend/public/temp/`;
            fs.mkdirsSync(path);
            callback(null, path);
        },
        filename: (req, file, callback) => {
            callback(null, 0 + "." + 'jpg');
        }
    })
})

const commandForQuery = ["C:\\Users\\Admin\\anaconda3\\Scripts\\activate",
    "python F:\\Online-Marketplace\\img_searcg\\main.py --action query --imPath F:\\Online-Marketplace\\frontend\\public\\temp\\0.jpg"]
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

customerRouter.get('/product/:productId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const productId = req.params.productId;
    Product.findById({_id : productId}).exec((err, document) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: { msgBody: "Couldn't find the product", msgError: true } });
        }
        else {
            res.status(200).json({ product: document, authenticated: true });
        }
    });
});

customerRouter.post('/searchImage', upload.single('productImage'), passport.authenticate('jwt', { session: false }), (req, res) => {
    const {exec} = require('child_process');

    exec(commandForQuery[0],(error, stdout, stderr) => {
        if (error) return;
        if (stderr) return;
        console.log(0, stdout);
        exec(commandForQuery[1],(error, stdout, stderr) => {
                        if (error) return;
                        if (stderr) return;
                        console.log(1, stdout);
                        res.status(200).json({ productId: stdout, authenticated: true });
        });
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


customerRouter.post('/isReceived', passport.authenticate('jwt', { session: false }), (req, res) => {

    const orderId = req.body.orderId;
    Order.findById({ _id: orderId }).exec((err , document) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: { msgBody: "Error has occured. Try again.", msgError: true } });
        }
        else {
            document.isReceived = "true";
            document.save(err => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: { msgBody: "Error has occured.", msgError: true } });
                }
                res.status(200).json({ message: { msgBody: "Order has been received", msgError: false }, authenticated: true });
            });
            
        }
    });
});



module.exports = customerRouter;