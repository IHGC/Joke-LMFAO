const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const jokeSchema = new Schema({
    body:String,
    rateAvg: { type: Number, default: 0 },
    rates: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User"
        },
        rate: Number
      }
    ],
    userId:{
        type: Schema.Types.ObjectId,
        ref:'User'
      }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Joke = mongoose.model('Joke', jokeSchema);
module.exports = Joke;
