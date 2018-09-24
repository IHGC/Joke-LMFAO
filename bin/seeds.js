// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Joke = require("../models/Joke");
const axios = require("axios")
const bcryptSalt = 10;

mongoose
  .connect('mongodb://localhost/project2', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

let users = [
  {
    username: "alice",
    password: bcrypt.hashSync("alice", bcrypt.genSaltSync(bcryptSalt)),
  },
  {
    username: "bob",
    password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
  },
  {
    username: "carl",
    password: bcrypt.hashSync("carl", bcrypt.genSaltSync(bcryptSalt)),
  },
  {
    username: "dave",
    password: bcrypt.hashSync("dave", bcrypt.genSaltSync(bcryptSalt)),
  },
  {
    username: "edd",
    password: bcrypt.hashSync("edd", bcrypt.genSaltSync(bcryptSalt)),
  }
]
// https://api.chucknorris.io/jokes/random
User.deleteMany()
.then(() => {
  User.collection.drop();
  return User.create(users)
})
.then(usersCreated => {
  console.log(`${usersCreated.length} users created with the following id:`);
  console.log(usersCreated.map(u => u._id));
  let usersJokes=usersCreated.map(u=>{
    let jokes=[]
    for(let i=0;i<5;i++){
      jokes.push(
          axios.get("https://api.chucknorris.io/jokes/random")
          .then((joke)=>{
            return {
              userId:u._id,
              body:joke.data.value
            }
          })
      )
    }
    return Promise.all(jokes)
  })
  return Promise.all(usersJokes)
})
.then((jokesArr) => {
  Joke.collection.drop();
  let jokeDB=jokesArr.map(joke=>{
                return Joke.create(joke)
              })
  return Promise.all(jokeDB)
})
.then((jokes) => {
  console.log(jokes);
  // Close properly the connection to Mongoose
  mongoose.disconnect()
})
.catch(err => {
  mongoose.disconnect()
  throw err
})