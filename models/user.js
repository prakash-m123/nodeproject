const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
     type: String,
     required: true
   },
    email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
 carts: [
    {
      product:{
      type: Schema.Types.ObjectId,
      ref:'Product'
      }
    }
  
 ]
});


module.exports = mongoose.model('User', userSchema);