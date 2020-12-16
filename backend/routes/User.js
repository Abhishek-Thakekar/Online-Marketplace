const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const signToken = userID =>{
    return JWT.sign({
        iss : "OnlineMarketplace",
        sub : userID
    },"OnlineMarketplace",{expiresIn : "1h"});
}

userRouter.post('/register',(req,res)=>{
    const {username,email,password,firstname,lastname,profile, address} = req.body;
    User.findOne({$or : [{username} ,{email}]},(err,user)=>{
        if(err){
            console.log(err);
            res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
        }
        if(user)
            res.status(400).json({message : {msgBody : "Username or email is already taken", msgError: true}});
        else{
            const newUser = new User({username,email,password,firstname,lastname,profile,address});
            newUser.save(err=>{
                if(err){
                    console.log(err);
                    res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
                }
                else
                    res.status(201).json({message : {msgBody : "Account successfully created", msgError: false}});
            });
        }
    });
});



userRouter.post('/login',passport.authenticate('local',{session : false}),(req,res)=>{
    if(req.isAuthenticated()){
       const {_id} = req.user;
       const token = signToken(_id);
       res.cookie('access_token',token,{httpOnly: true, sameSite:true}); 
       res.status(200).json({isAuthenticated : true,message : {msgBody : "Successfully logged in", msgError: false},user : req.user});
    }
    else{
        res.status(500).json({message : {isAuthenticated:false ,msgBody : "Incorrect username or password", msgError: true}});
    }
});

userRouter.get('/logout',passport.authenticate('jwt',{session : false}),(req,res)=>{
    console.log(req);
    res.clearCookie('access_token');
    res.json({user:{username : "", role : ""},success : true});
});

// userRouter.post('/todo',passport.authenticate('jwt',{session : false}),(req,res)=>{
//     const todo = new Todo(req.body);
//     todo.save(err=>{
//         if(err)
//             res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
//         else{
//             // console.log("req user in todos : ", req.user);
//             req.user.todos.push(todo);
//             req.user.save(err=>{
//                 if(err)
//                     res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
//                 else
//                     res.status(200).json({message : {msgBody : "Successfully created todo", msgError : false}});
//             });
//         }
//     })
// });

// userRouter.get('/todos',passport.authenticate('jwt',{session : false}),(req,res)=>{
//     User.findById({_id : req.user._id}).populate('todos').exec((err,document)=>{
//         // console.log('document : ' , document);
//         if(err)
//             res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
//         else{
//             res.status(200).json({todos : document.todos, authenticated : true});
//         }
//     });
// });



userRouter.get('/authenticated',passport.authenticate('jwt',{session : false}),(req,res)=>{
    // const {username,email,firstname,lastname,password,profile,address,role,cart,orders} = req.user;
    res.status(200).json({isAuthenticated : true, user : req.user });
});





module.exports = userRouter;