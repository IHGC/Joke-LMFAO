const express = require("express");
const router = express.Router();
const Joke = require("../models/Joke");
const User = require("../models/User");
const { isRatedByUser, addMarkTag,isOwner } = require("../middlewares/helpers");

router.post("/", (req, res, next) => {
  const { search } = req.body;
  User.find({ username: { $regex: `.*${search}.*`,$options:'i' } })
  .then(users=>{
    let userNames=users.map(user=>{
      return {userId:user._id}
    })
    if(!userNames.length){
      userNames.push({userId:null})
    }
    Joke.find({
      $or: [{ body: { $regex: `.*${search}.*`,$options:'i' } }, { $or: userNames }]
    })
    .populate("userId")
    .then(jokes => {
      if(req.user){
        jokes=isRatedByUser(jokes,req.user.id)
        jokes=isOwner(jokes,req.user.id)
      }
      jokes=addMarkTag(jokes,search)

      res.render("search", { jokes, search });
    });
  })
});

module.exports = router;
