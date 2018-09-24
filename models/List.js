const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const listSchema = new Schema({
    title:String,
    users:[]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
