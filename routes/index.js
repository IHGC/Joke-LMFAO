const express = require('express');
const router  = express.Router();
const Joke = require("../models/Joke")
const User = require("../models/User")

/* GET home page */
router.get('/', (req, res, next) => {
  Joke.find().sort({created_at:-1}).limit(5).populate("userId")
  .then(jokes=>{
    res.render("index",{jokes})
  })
});


router.get("/profile/:id",(req,res)=>{
  let isOwner= (req.params.id == req.user.id);
  Joke.find({userId:req.params.id})
  .then(jokes=>{
    User.findById(req.params.id)
    .then(us=>{
      res.render("profile",{jokes,us,isOwner})
    })
  })
})

module.exports = router;
