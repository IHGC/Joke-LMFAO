const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User          = require('../models/User');
const bcrypt        = require('bcrypt');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, 
  (email, password, done) => {
    let arr=[ User.findOne({ email }),User.findOne({username: email})];
   Promise.all(arr)
    .then(finds=>{
     let user = finds.find(find=>{
        return find!=null
      })
      if(!user){
        done(null, false, { message: 'Incorrect username or password' })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        done(null, false, { message: 'Incorrect email or password' });
        return;
      }
      done(null, user);
    })
    .catch(err => done(err));
  }
));
