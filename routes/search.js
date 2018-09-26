const express = require("express");
const router = express.Router();
const Joke = require("../models/Joke");
const User = require("../models/User");
const { isRatedByUser, addMarkTag } = require("../middlewares/helpers");
router.post("/", (req, res, next) => {
  const { search } = req.body;
  User.find({ username: { $regex: `.*${search}.*` } })
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
      jokes=addMarkTag(jokes,search)
      // console.log(jokes)
      res.render("search", { jokes, search });
    });
  })
});

router.post("/:id/delete", (req, res, next) => {
  User.find().then(users => {
    res.render("list/new", { users });
  });
});

module.exports = router;
