const mongoose =require('mongoose');

const Schema = mongoose.Schema;

const  cartSchema = new Schema({

    product:{
        type:Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    quantity:{
        type:Number,
        default:1
    },

    creator:{
        type:Schema.Types.ObjectId,
        ref:'User'
        
    }
});




module.exports = mongoose.model('Cart', cartSchema);

