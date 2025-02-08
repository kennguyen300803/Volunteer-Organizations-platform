var express = require('express');
var router = express.Router();

/* GET manager page. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  next();
});

module.exports = router;

// any request for manager settings will go through here, and should use proper authentication