require('dotenv').config();
// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Joke = require("../models/Joke");
const List = require("../models/List");
const Follow = require("../models/Follow");
const FollowList = require("../models/FollowList");

const axios = require("axios");
const bcryptSalt = 10;

mongoose
  .connect(
    process.env.URL_DB,
    { useNewUrlParser: true }
  )
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

let users = [
  {
    username: "alice",
    email: "alice@alice",
    password: bcrypt.hashSync("alice", bcrypt.genSaltSync(bcryptSalt))
  },
  {
    username: "bob",
    email: "bob@bob",
    password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt))
  },
  {
    username: "carl",
    email: "carl@carl",
    password: bcrypt.hashSync("carl", bcrypt.genSaltSync(bcryptSalt))
  },
  {
    username: "dave",
    email: "dave@dave",
    password: bcrypt.hashSync("dave", bcrypt.genSaltSync(bcryptSalt))
  },
  {
    username: "edd",
    email: "edd@edd",
    password: bcrypt.hashSync("edd", bcrypt.genSaltSync(bcryptSalt))
  }
];
let lists = [
  { title: "Lista 1", users: [] },
  { title: "Lista 2", users: [] }
];
let follows = [];
return User.deleteMany()
  .then(() => {
    return User.create(users);
  })
  .then(usersCreated => {
    console.log(`${usersCreated.length} users created with the following id:`);
    console.log(usersCreated.map(u => u._id));
    let usersJokes = usersCreated.map(u => {
      let jokes = [];
      for (let i = 0; i < 5; i++) {
        jokes.push(
          axios.get("https://api.chucknorris.io/jokes/random").then(joke => {
            return {
              userId: u._id,
              body: joke.data.value
            };
          })
        );
      }
      return Promise.all(jokes);
    });
    return Promise.all(usersJokes);
  })
  .then(jokesArr => {
    Joke.collection.drop();
    let jokeDB = jokesArr.map(joke => {
      return Joke.create(joke);
    });
    return Promise.all(jokeDB);
  })
  .then(jokes => {
    console.log(`${jokes.length*jokes.length} jokes created`);
    return User.find();
  })
  .then(users => {
    
    users.forEach((user, index, users) => {
      if (index == 1) {
        lists[0].ownerId = user._id;
      }
      if (index == 2) lists[1].ownerId = user._id;
      if (index <= 2) {
        lists[0].users.push(user._id);
        follows.push({
          followerId: user._id,
          followedId: users[index + 1]._id
        });
      }
      if (index >= 2) {
        lists[1].users.push(user._id);
        follows.push({
          followerId: user._id,
          followedId: users[index - 1]._id
        });
      }
    });
    List.collection.drop();
    return List.create(lists);
  })
  .then(lists => {
    console.log(`${lists.length} lists created`);
    Follow.collection.drop();
    return Follow.create(follows);
  })
  .then((follows) => {
    console.log(`${follows.length} follows created`);
    FollowList.collection.drop();
    return Promise.all([User.find(),List.find()])
  })
  .then(arr=>{
    const [users,lists]=arr
    const followLists=[{
                followerId:users[0].id,
                followedListId:lists[0].id
              },{
                followerId:users[1].id,
                followedListId:lists[0].id
              },{
                followerId:users[2].id,
                followedListId:lists[1].id
              },{
                followerId:users[3].id,
                followedListId:lists[1].id
              }]
    return FollowList.create(followLists)
  })
  .then(followLists=>{
    console.log(`${followLists.length} followLists created`)
    // Close properly the connection to Mongoose
    mongoose.disconnect();
  })
  .catch(err => {
    mongoose.disconnect();
    throw err;
  });
