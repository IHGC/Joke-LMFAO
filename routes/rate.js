const express = require("express");
const router = express.Router();
const Joke = require("../models/Joke");

router.post("/:id", (req, res, next) => {
  const userId = req.user.id
  const rate = parseInt(req.body.rate)
  const jokeId = req.params.id
  console.log("prueba",{rates:{$push:{userId,rate}}})
  Joke.findOneAndUpdate({_id:jokeId},{$push:{rates:{rate,userId}}})
    .then(joke => {
      let tot=rate
      for(let i=0;i<joke.rates.length;i++){
        tot+=parseInt(joke.rates[i].rate)
      }
      let rateAvg=(tot/(joke.rates.length+1)).toFixed(2)
      
      Joke.findOneAndUpdate({_id:jokeId},{rateAvg})
      .then(()=>res.redirect(req.get('referer')))
      .catch(e => next(e));
    })
    .catch(e => next(e));
});

router.post("/:id/delete", (req, res, next) => {
  User.find().then(users => {
    res.render("list/new", { users });
  });
});

module.exports = router;
