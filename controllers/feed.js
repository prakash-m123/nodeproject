const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const Product = require('../models/product');
const Admin = require('../models/admin');

exports.getProducts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  //console.log(req);

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

exports.createProduct = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  const price = req.body.price;
  let creator;
  const product = new Product({
    imageUrl: imageUrl,
    title: title,
    content: content,
    price:price,
    creator: req.adminId
  });
  product
    .save()
    .then(result => {
      return Admin.findById(req.adminId);
    })
    .then(admin => {
      creator = admin;
      admin.products.push(product);
      return admin.save();
    })
    .then(result => {
      res.status(201).json({
        message: 'Product created successfully!',
        product: product,
        creator: { _id: creator._id, name: creator.name }
      });
      //console.log(req);
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then(product => {
      if (!product) {
        const error = new Error('Could not find product.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Product fetched.', product: product });
      //console.log(req);
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
     
      next(err);
    });
};

exports.updateProduct = (req, res, next) => {
  const productId = req.params.productId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  const price = req.body.price;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }
  Product.findById(productId)
    .then(product => {
      if (!product) {
        const error = new Error('Could not find product.');
        error.statusCode = 404;
        throw error;
      }
      if (product.creator.toString() !== req.adminId) {
        const error = new Error('Not authorized!');
        error.statusCode = 403;
        throw error;
      }
      if (imageUrl !== product.imageUrl) {
        clearImage(product.imageUrl);
      }
      product.title = title;
      product.imageUrl = imageUrl;
      product.content = content;
      product.price = price;
      return product.save();
      
    })
    .then(result => {
      res.status(200).json({ message: 'Product updated!', product: result });
      //console.log(req);
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then(product => {
      if (!product) {
        const error = new Error('Could not find product.');
        error.statusCode = 404;
        throw error;
      }
      if (product.creator.toString() !== req.adminId) {
        const error = new Error('Not authorized!');
        error.statusCode = 403;
        throw error;
      }
     
      // Check logged in user
      clearImage(product.imageUrl);
      return Product.findByIdAndRemove(productId);
    })
    .then(result => {
      return Admin.findById(req.adminId);
      
    })
    .then(admin => {
      admin.products.pull(productId);
      return admin.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Deleted product.' });
      
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};