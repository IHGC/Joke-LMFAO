const express = require('express');
const router  = express.Router();
const Joke = require("../models/Joke")
const User = require("../models/User")
const Follow = require ("../models/Follow")
const {ensureLoggedOut} = require ("../middlewares/ensureLoggedIn")
const {isRatedByUser} = require("../middlewares/helpers")


/* GET home page */
router.get('/', ensureLoggedOut("/profile"),(req, res, next) => {
  Joke.find().sort({rateAvg:-1}).limit(10).populate("userId")
  .then(jokes=>{
    res.render("index",{jokes})
  })
});

router.get("/profile", (req,res)=>{
  user=req.user;
  Follow.find({ followerId: user.id }).then(users => {
    if (users.length == 0) {
      res.render("profile")
    }
    else {
      let arr = [];
      users.forEach(e => {
        arr.push({ userId: e.followedId })
      })
      Joke.find({ $or: arr }).populate("userId").then(jokes => {
        jokes=isRatedByUser(jokes,user.id)
        res.render("profile", {jokes})
      })
    }
  })
})

router.get("/profile/:id",(req,res)=>{
  Joke.find({userId:req.params.id})
  .then(jokes=>{
    User.findById(req.params.id)
    .then(us=>{
      Follow.find({followerId: req.params.id})
      .then(following=>{
        Follow.find({followedId:req.params.id})
        .then(followers=>{
          if(!req.user){
            res.render("profileId",{jokes,us,followers,following})
          }
          else{
            Follow.find({$and:[{followerId:req.user.id},{followedId:req.params.id}]})
          .then(checkFollow=>{
            let check=false;
            if(checkFollow.length==0){
              check=true;
            }
            jokes=isRatedByUser(jokes,req.user.id)
            res.render("profileId",{jokes,us,followers,following,check})
          })
          }
        })
      })
    })
  })
})

router.get("/explore",(req,res)=>{
  user=req.user
  Joke.find().sort({created_at:-1}).populate("userId")
  .then(jokes=>{
    let ranking=false;
    jokes=isRatedByUser(jokes,user.id)
    res.render("explore",{jokes,ranking})
  })
});

router.get("/ranking",(req,res)=>{
  user=req.user
  Joke.find().sort({rateAvg:-1}).limit(10).populate("userId")
  .then(jokes=>{
    let ranking=true;
    jokes=isRatedByUser(jokes,user.id)
    res.render("explore",{jokes,ranking})
  })

})




module.exports = router;
