const express = require('express');
const { body } = require('express-validator');

const Admin = require('../models/admin');
const authController = require('../controllers/auth');


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
        return Admin.findOne({ email: value }).then(userDoc => {
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
  authController.signup
);

router.post('/login', authController.login);


module.exports = router;