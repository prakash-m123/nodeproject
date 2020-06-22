const fs=require('fs');


const Product =require('../models/product');
const User=require('../models/user');
const Cart=require('../models/cart');
const product = require('../models/product');


exports.getProducts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
   
  
    Product.find()
      .countDocuments()
      .then(count => {
        totalItems = count;
        return Product.find()
          .skip((currentPage - 1) * perPage)
          .limit(perPage);
      })
      .then(products => {
        res.status(200).json({
          message: 'Fetched products successfully.',
          products: products,
          totalItems: totalItems
        });
       
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };
  exports.getCart=(req,res,next)=>{
   req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      if(!user){
        const error = new Error('Could not find the user.');
        error.statusCode = 401;
        throw error;
      }
      const products = user.cart;
      res.status(200).json({message: 'Get cart products successfully',  products: products}) ;
      
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

  };

  exports.postCart=(req,res,next)=>{
     const productId=req.body.productId;
     Product.findById(productId)
     let creator;
    
     const cart = new Cart({
       product:req.body.product,
       quantity:req.body.quantity,
         creator:req.userId
     });
     cart.save()
     .then(result =>{
       return User.findById(req.userId);
       
     })
     .then(user => {
      creator =user;
      user.carts.push(cart);
      return user.save();
    })
     
    .then(result =>{
          res.status(201).json({message:'product will added to the cart', cart:cart,
          creator: { _id: user._id, name: user.firstname }});
      })
     
     .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });


    };