const express = require('express');
const router = express.Router();
const Joke = require("../models/Joke");
const User = require("../models/User");
const ensureLoggedIn = require("../middlewares/ensureLoggedIn")

router.get("/add",ensureLoggedIn("/"),(req, res) => {
    res.render("jokes/add")
});

router.post("/add", (req, res) => {
    const newJoke = {
        body: req.body.joke,
        userId: req.user.id
    }
    new Joke(newJoke).save()
        .then(() => {
            res.redirect("/")
        })
})

router.get("/list",ensureLoggedIn("/"), (req, res) => {
    Joke.find({userId:req.user.id}).populate("userId").then(jokes=> {
        console.log(jokes)
        res.render("jokes/list",{jokes});
    })
});

router.get("/edit/:id", (req, res) => {
    Joke.findById(req.params.id).then(joke => {
        res.render("jokes/edit", { joke });
    })
})

router.post("/edit/:id",(req,res)=>{
    const body=req.body.joke
    Joke.findByIdAndUpdate(req.params.id,{body})
    .then(()=>{
        res.redirect("/jokes/list")
    })
})

router.get("/delete/:id",(req,res)=>{
    Joke.findByIdAndRemove(req.params.id)
    .then( () => res.redirect('/jokes/list'));
})





module.exports = router;