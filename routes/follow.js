const express = require("express");
const router = express.Router();
const Follow = require("../models/Follow");
const FollowList = require("../models/FollowList");

/* GET home page */
// lista a quien sigues
router.get("/following", (req, res, next) => {
  Follow.find({ followerId: req.user.id })
    .populate("followedId")
    .then(users => {
      users = users.map(u => u.followedId);
      res.render("follow", { following: true, users });
    })
    .catch(e => next(e));
});
//lista quien sigue a :id
router.get("/following/:id", (req, res, next) => {
  Follow.find({ followerId: req.body.id })
    .populate("followedId","followerId")
    .then(users => {
      users = users.map(u => u.followedId);
      res.render("follow/following", { following: true, users});
    })
    .catch(e => next(e));
});
//lista quien te sigue
router.get("/followed", (req, res, next) => {
  Follow.find({ followedId: req.user.id })
    .populate("followerId")
    .then(users => {
      users = users.map(u => u.followerId);
      res.render("follow", { following: false, users });
    })
    .catch(e => next(e));
});
// Lista quien sigue a id
router.get("/followed/:id", (req, res, next) => {
  Follow.find({ followedId: req.body.id })
    .populate("followerId","followerId")
    .then(users => {
      users = users.map(u => u.followerId);
      res.render("follow", { following: false, users,user:users[0].followedId });
    })
    .catch(e => next(e));
});

router.get("/follow/:id",(req,res,next)=>{
  const followedId=req.params.id
  const followerId=req.user.id
  Follow.create({followerId,followedId})
  .then((f)=>{
    res.redirect(req.get('referer'));
  }).catch(e=>next(e))
})

router.get("/follow/:id/delete",(req,res,next)=>{
  const followedId=req.params.id
  const followerId=req.user.id
  Follow.findOneAndDelete({$and:[{followerId},{followedId}]})
  .then(()=>{
    res.redirect(req.get('referer'));
  }).catch(e=>next(e))
})


module.exports = router;
