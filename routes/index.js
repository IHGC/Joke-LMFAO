const express = require('express');
const router  = express.Router();
const Joke = require("../models/Joke")
const User = require("../models/User")
const Follow = require ("../models/Follow")
const {ensureLoggedOut,ensureLoggedIn} = require ("../middlewares/ensureLoggedIn")
const {isRatedByUser} = require("../middlewares/helpers")
const uploadCloud = require('../config/cloudinary.js');
const bcrypt = require("bcrypt")
// const flash = require('connect-flash')

// router.use(flash())
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

router.get("/profile/edit",ensureLoggedIn('/auth/login'),(req,res,next)=>{
  res.render('user/profile',{user:req.user, message: req.flash("error")})
})
//uploadCloud.single('image'),
router.post("/profile/edit",ensureLoggedIn('/auth/login'),uploadCloud.single('image'),(req,res,next)=>{
  console.log(req.body,req.params,req.query)
  const {username,email,oldPassword,password,password2}=req.body
  const image = req.file
  const userId=req.user.id
  const userPassword=req.user.password
  const update={}
  const bcryptSalt=10
  const salt = bcrypt.genSaltSync(bcryptSalt);
  User.findById(userId)
  .then(user=>{
    if(password||password2){
      if(password==password2){
        if(oldPassword){
          if(bcrypt.compareSync(oldPassword,userPassword)){
            update.password=bcrypt.hashSync(password, salt);
          }else{
            req.flash("error","Contraseña anterior erronea")
            res.redirect("/profile/edit")
            return  
          }
        }else{
          req.flash("error","Se encesita la contraseña anterior para cambiar la contraseña")
          res.redirect("/profile/edit")
          return
        }
      }else{
        req.flash("error","Las contraseñas no coinciden")
        res.redirect("/profile/edit")
        return
      }
    }
    if(username && user.username!=username) update.username=username
    if(email && user.email!=email) update.email=email
    if(image) update.image=image.secure_url
    if(!Object.keys(update).length){
      req.flash("error","No hay cambios")
        res.redirect("/profile/edit")
        return
    }
    User.find({username:update.username})
    .then(user=>{
      if(user.length){
        req.flash("error",`El usuario ${user[0].username} ya existe`)
        res.redirect("/profile/edit")
        return
      }
      User.find({email:update.email})
      .then(user=>{
        if(user.length){
          req.flash("error",`El email ${user[0].email} ya está siendo utilizado`)
          res.redirect("/profile/edit")
          return
        }
        User.findByIdAndUpdate(userId,update)
          .then(u=>{
            console.log(u,update)
            req.flash("error",`Usuario actualizado`)
            res.redirect("/profile/edit")
            return
          })
          .catch(e=>next(e))
      })
    }).catch(e=>next(e))
  }).catch(e=>next(e))
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
    if (user) {
      jokes = isRatedByUser(jokes, user.id)
    }
    res.render("explore",{jokes,ranking})
  })
});

router.get("/ranking", (req, res) => {
  user = req.user
  Joke.find().sort({ rateAvg: -1 }).limit(10).populate("userId")
    .then(jokes => {
      let ranking = true;
      if (user) {
        jokes = isRatedByUser(jokes, user.id)
      }
      res.render("explore", { jokes, ranking })
    })
})




module.exports = router;
