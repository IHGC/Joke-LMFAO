const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const listSchema = new Schema({
    ownerId:{
      type:Schema.Types.ObjectId,
      ref:'User'
    },
    title:String,
    users:[]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const List = mongoose.model('List', listSchema);
module.exports = List;
