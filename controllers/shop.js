const fs=require('fs');


const Product =require('../models/product');
const User=require('../models/user');
const product = require('../models/product');

exports.getProducts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    console.log(req);
  
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
       // console.log(req);
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
      const products = user.cart.items;
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
     const productId=req.params.productId;
     Product.findById(productId)
     .then(product =>{
    
     return user.save(product);
   
      })
        .then(result =>{
          res.status(201).json({message:'product will added to cart'});
      })
     
     .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });


    };