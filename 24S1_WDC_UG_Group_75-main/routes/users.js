var express = require('express');
var router = express.Router();

// Middleware used to verify the user is logged in
/*router.use('/', function(req,res,next){
  if(!('username' in req.session)){
    res.sendStatus(403);
  } else{
    next();
  }
});

/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  next();
});*/

// post /login

// post /signup

// get /currentsettings? something like that

// post /settings

// retrieve every user

module.exports = router;