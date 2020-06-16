const express = require('express');
const { body } = require('express-validator');

const User=require('../models/user');
const userauthController=require('../controllers/userauth');


const router = express.Router();

router.put(
  '/signup',
  [
    body('name')
    .trim()
    .not()
    .isEmpty(),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 })
   
  ],
  userauthController.signup
);

router.post('/login', userauthController.login);


module.exports = router;