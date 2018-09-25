const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const followSchema = new Schema({
    followerId:{
      type:Schema.Types.ObjectId,
      ref:'User'
    },
    followedId:{
      type:Schema.Types.ObjectId,
      ref:'User'
    }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Follow = mongoose.model('Follow', followSchema);
module.exports = Follow;
