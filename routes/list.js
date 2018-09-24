const express = require("express");
const router = express.Router();
const List = require("../models/List");
const User = require("../models/User");

/* GET home page */
router.get("/", (req, res, next) => {
  List.find()
    .populate("ownerId")
    .populate("users")
    .then(lists => {
      lists = lists.map((list) => {
          list.edit = req.user && (list.ownerId._id == req.user.id);
        return list;
      });
      res.render("list", { lists });
    })
    .catch(e => next(e));
});
router.get("/new", (req, res, next) => {
  User.find().then(users => {
    res.render("list/new", { users });
  });
});
router.post("/new", (req, res, next) => {
  console.log(req.body);
  const ownerId = req.user.id;
  console.log(req.user);
  const { title, users } = req.body;
  List.create({ ownerId, title, users })
    .then(() => res.redirect("/list"))
    .catch(e => next(e));
});
router.get("/user/:id", (req, res, next) => {
  List.find({ ownerId: req.params.id })
    .populate("ownerId")
    .populate("users")
    .then(lists => {
      lists = lists.map(list => {
        list.edit = req.user && list.ownerId._id == req.user.id;
        return list;
      });
      res.render("list/user", { lists });
    })
    .catch(e => next(e));
});
router.get("/:id", (req, res, next) => {
  User.find()
    .then(users => {
      List.findById(req.params.id).then(list => {
        users.forEach(u => {
          // list.users.includes(u.id) no funciona
          // porque un subdocumento de mongoo es como un
          // array pero no es un array
          if (list.users.indexOf(u.id) > -1) {
            u.selected = true;
          }
          return u;
        });
        console.log(users);
        res.render("list/update", { title: list.title, id: list.id, users });
      });
    })
    .catch(e => next(e));
});
router.post("/:id/update", (req, res, next) => {
  console.log(req.params);
  const { title, users } = req.body;
  List.findByIdAndUpdate(req.params.id, { title, users })
    .then(() => res.redirect("/list"))
    .catch(e => next(e));
});
router.post("/:id/delete", (req, res, next) => {
  console.log(req.params);
  List.findByIdAndDelete(req.params.id)
    .then(() => res.redirect("/list"))
    .catch(e => next(e));
});

module.exports = router;
