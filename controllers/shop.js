const fs=require('fs');


const Product =require('../models/product');
const User=require('../models/user');
const Cart=require('../models/cart');
const Order=require('../models/order');


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
   const userId=req.params.userId;
    User.findById(userId)
    .then(user=>{
      if(!user){
        const error=new Error('could not find user');
        error.statusCode=404;
        throw error;
      }
  //  const cartId=req.params.cartId;
  //   Cart.findById(cartId)
  //   .then(cart => {
      // if(user.cartId!==req.cartId){
      //   const error = new Error('Could not find the user.');
      //   error.statusCode = 401;
      //   throw error;
      // }
      //const products = user.cart;
      res.status(200).json({message: 'Get cart products successfully', cart:user.carts });
      
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

  };

  exports.postCart=(req,res,next)=>{
   const userId=req.params.userId;
    User.findById(userId)
      let creator;
     const cart = new Cart({
     product:req.body.productId,
     quantity:req.body.quantity,
     creator:req.params.userId
     });
      cart.save()
     
      .then(result =>{
        return User.findById(req.params.userId);
       
      })
      .then(user => {
       creator = user;
       user.carts.push(cart);
       return user.save();
     })
     
    .then(result =>{
          res.status(201).json({message:'product will added to the cart', cart:cart,
          creator: {
           _id: req.params.userId ,
            name:result.name,
            email:result.email 
          }});
      })
     
     .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

  };
  
  exports.postOrder=(req, res, next) => {
    const userId=req.params.userId;
    User.findById(userId)
    .populate('carts.productId')
          .then(user => {
        const products = user.carts.map(i => {
          return { quantity: i.quantity, product:{ ...i.productId._id } };
          
        });
        console.log(products);  
        const order = new Order({
          user: {
            email: req.body.email,
            userId: req.body.userId
          },
          
          products:products
          
        });
        return order.save();
      })
      .then(result => {
        res.status(201).json({message: 'Order stored'  });
      })
      .catch(err => {
       if(!err){
         err.statusCode=500;
       }
       next(err);
      });
  };

  exports.getOrder=(req, res, next) => {
    Order.findById(req.params.orderId)
      .populate('product')
      .then(order => {
        if (!order) {
         const error =new Error('order not found');
         error.statusCode=404;
         throw error;
        }
        res.status(200).json({
          order: order
          
        });
      })
      .catch(err => {
        if(!err.statusCode){
          err.statusCode=500;
        }
        next(err);
      });
  };