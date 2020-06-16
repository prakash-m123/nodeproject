const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Admin = require('../models/admin');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      const admin = new Admin({
        name: name,
        email: email,
        password: hashedPw,
        
      });
      return admin.save();
      
    })
    
    .then(result => {
      res.status(201).json({ message: 'User created!', adminId: result._id });
    })
   
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
 
  Admin.findOne({ email: email })
    .then(admin => {
      if (!admin) {
        const error = new Error('A user with this email could not be found.');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = admin;
      return bcrypt.compare(password, admin.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          adminId: loadedUser._id.toString()
          
        },
        
        'somesupersecretsecret',
        { expiresIn: '1h' }
      );
      res.status(200).json({ token:token, adminId:loadedUser._id.toString() ,email:email});
  
   })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
    
};
