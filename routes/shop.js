const express=require('express');
const { body }= require('express-validator');

const shopController=require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router=express.Router();

router.get('/products',isAuth,shopController.getProducts);

router.get('/getcart',isAuth,shopController.getCart);

router.put('/postcart/:productId',isAuth,shopController.postCart);

module.exports = router;