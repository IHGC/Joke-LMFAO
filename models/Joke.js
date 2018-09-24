const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const jokeSchema = new Schema({
    body:String,
    rate:Number,
    userId:{
        type: Schema.Types.ObjectId,
        ref:'users'
      }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Joke = mongoose.model('Joke', jokeSchema);
module.exports = Joke;
