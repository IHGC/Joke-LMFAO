const express = require("express");
const router = express.Router();
const Joke = require("../models/Joke");

router.post("/:id", (req, res, next) => {
  const userId = req.user.id
  const rate = parseInt(req.body.rate)
  console.log(rate)
  const jokeId = req.params.id
<<<<<<< HEAD
  Joke.findOne({$and:[{_id:jokeId},{"rates.userId":userId}]})
  .then(joke=>{
    if(joke){
      return Joke.findOneAndUpdate({$and:[{_id:jokeId},{"rates.userId":userId}]},{$set:{"rates.$.rate":rate}})
    }else{
      return Joke.findOneAndUpdate({_id:jokeId},{$push:{rates:{rate,userId}}})
    }
  })
  .then(joke=>{
    Joke.findById(jokeId)
    .then(joke=>{
      console.log(joke)
      console.log(rate)
      let tot=0
      for(let i=0;i<joke.rates.length;i++){
        tot+=parseInt(joke.rates[i].rate)
      }
      console.log(tot,joke.rates.length)
      let rateAvg=(tot/joke.rates.length) //  .toFixed(2)
=======
  console.log("prueba",{rates:{$push:{userId,rate}}})
  Joke.findOneAndUpdate({_id:jokeId},{$push:{rates:{rate,userId}}})
    .then(joke => {
      let tot=rate
      for(let i=0;i<joke.rates.length;i++){
        tot+=parseInt(joke.rates[i].rate)
      }
      let rateAvg=(tot/(joke.rates.length+1)).toFixed(2)
      
>>>>>>> 54b0bd5c380531f3a3d87ea7eca5dd6908c45063
      Joke.findOneAndUpdate({_id:jokeId},{rateAvg})
        .then((joke)=>{
          res.json({status:"ok",rate:rateAvg})
        })
        .catch(e => {
          res.json({status:"error",error:e})
        });
    })    
  }).catch(e => next(e));
});

router.post("/:id/delete", (req, res, next) => {
  User.find().then(users => {
    res.render("list/new", { users });
  });
});

module.exports = router;
