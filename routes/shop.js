const express=require('express');
//const { body }= require('express-validator');

const shopController=require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router=express.Router();

router.get('/products',isAuth,shopController.getProducts);

router.get('/getcart/:userId',isAuth,shopController.getCart);

router.put('/postcart/:userId',isAuth,shopController.postCart);


router.post('/postorder/:userId',isAuth,shopController.postOrder);


router.get('/getorder',isAuth,shopController.getOrder);


module.exports = router;