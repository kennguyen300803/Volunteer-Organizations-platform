var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  if(req.session.userID) {
    res.sendFile('/_user_page.html', {root: 'static_org'});
  } else {
    res.sendFile('/_public_page.html', {root: 'static_org'});
  }
});


router.get('/get_orgs', function(req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT orgID, branchName FROM organisations";
    connection.query(query, function (error, rows) {
      connection.release();
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

router.get('/show_users', function(req, res, next){
  var orgID = req.query.org;
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT users.firstName, users.lastName, users.userID, memberList.orgID FROM users INNER JOIN memberList WHERE users.userID = memberList.userID AND memberList.orgID = ?;";
    connection.query(query, orgID, function (error, rows, fields) {
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
  //console.log(req.query.event);
  //res.sendStatus(200);
});

// Add this to handle the join_org endpoint
router.post('/join_org', function (req, res) {
  let orgID = req.body.orgID;
  // Add logic to join the organisation
  req.session.currOrg = orgID;

  // Fetch the details of the joined organisation
  req.pool.getConnection(function (err, connection) {
      if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
      }
      var query = "SELECT orgID, branchName FROM organisations WHERE orgID = ?;";
      connection.query(query, [orgID], function (error, rows) {
          connection.release();
          if (error) {
              console.log(error);
              res.sendStatus(500);
              return;
          }
          res.json(rows[0]);
      });
  });
});

module.exports = router;