const express = require('express');
const { body } = require('express-validator');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /feed/products
router.get('/products', isAuth, feedController.getProducts);

// POST /feed/product
router.post(
  '/product',
  isAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.createProduct
);

router.get('/product/:productId', isAuth, feedController.getProduct);

router.put(
  '/product/:productId',
  isAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.updateProduct
);

router.delete('/product/:productId', isAuth, feedController.deleteProduct);


module.exports = router;