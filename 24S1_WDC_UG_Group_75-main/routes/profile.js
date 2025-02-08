var express = require('express');
var router = express.Router();

/* GET profile page. */
router.use('*', function(req,res,next) {
  if(!req.session.userID) {
    res.redirect('/');
  }
  next();
});

router.get('/', function(req, res, next) {
  res.sendFile('/profile.html', {root: 'static_user'});
});

router.get('/get_profile', function(req, res, next){
    req.pool.getConnection(function (err, connection) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        // console.log(req.session.userID);
        var query = "SELECT users.firstName, users.lastName, users.DOB, users.email, users.phonenumber FROM users WHERE users.userID = ?";
        connection.query(query, [req.session.userID], function (error, rows, fields) {
          connection.release();
          if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
          }
          //console.log(rows);
          res.json(rows);
        });
    });
});

router.get('/get_orgname', function(req, res, next){
    req.pool.getConnection(function (err, connection) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        var query = "SELECT organisations.branchName FROM organisations INNER JOIN memberList ON ? = memberList.userID WHERE organisations.orgID = memberList.orgID;";
        connection.query(query, req.session.userID, function (error, rows, fields) {
          connection.release();
          if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
          }
          console.log(rows);
          res.json(rows);
        });
    });
});

router.post('/edit_profile', function(req, res, next){
    req.pool.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      var query = "UPDATE users SET firstName = ?, lastName = ?, DOB = ?, email = ?, phonenumber = ? WHERE userID = ?;";
      connection.query(query, [req.body.firstName, req.body.lastName, req.body.DOB, req.body.email, req.body.phonenumber, req.session.userID], function (error, rows, fields) {
        connection.release();
        if (error) {
          console.log(error);
          res.sendStatus(500);
          return;
        }
        res.sendStatus(200);
      });
    });
  });


router.get('/subscribeBtn', function(req,res) {
  if(!req.session.userID) {
    res.sendStatus(403);
    return;
  }
  req.pool.getConnection(function (err, connection) {
    if (err) {
      //console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT mailingList.orgID FROM mailingList WHERE mailingList.userID = ?;";
    connection.query(query, [req.session.userID], function (error, rows, fields) {
      connection.release();
      if (error) {
        // console.log(rows);
        res.sendStatus(500);
        return;
      }
      let subscribed;
      // console.log(rows);
      if(!rows[0]) {
        subscribed = false;
      } else {
        subscribed = true;
      }
      // console.log(subscribed);
      res.json(subscribed);
    });
  });
});

router.post('/subscribeToggle', function(req, res) {
  if(!req.session.userID) {
    res.sendStatus(403);
    return;
  }
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      //console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT mailingList.orgID FROM mailingList WHERE mailingList.userID = ?;";
    var subbed = false;
    connection.query(query, [req.session.userID], function (error, rows, fields) {
      if (error) {
        // console.log(rows);
        console.log(error);
        res.sendStatus(500);
        return;
      }
      if(!rows[0]) {
        subbed = false;
      } else {
        subbed = true;
      }
      if(subbed == false) {
          let orgID = 0;
          query = 'SELECT memberList.orgID FROM memberList WHERE memberList.userID = ?;';
          connection.query(query, [req.session.userID], function (error, rows, fields) {
            if (error) {
              // console.log(rows);
              console.log(error);
              res.sendStatus(500);
              return;
            }
            orgID = rows[0].orgID;
            // console.log(orgID);
            query = 'INSERT INTO mailingList (userID, orgID) VALUES (?,?)';
            connection.query(query, [req.session.userID, orgID], function (error, rows, fields) {
            if (error) {
              console.log(error);
              res.sendStatus(500);
              return;
            }
            res.sendStatus(200);
            connection.release();
            return;
            });
          });
        } else {
          query = 'DELETE FROM mailingList WHERE mailingList.userID = ?;';
          connection.query(query, [req.session.userID], function (error, rows, fields) {
            if (error) {
              //console.log(rows);
              res.sendStatus(500);
              return;
            }
            res.sendStatus(200);
            connection.release();
            return;
          });
        }
      });
    });
    // console.log(subbed);
});

// everything above dis
module.exports = router;