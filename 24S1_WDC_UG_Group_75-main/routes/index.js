var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {
  res.sendFile('/main.html', {root: 'public'});
});

router.get('/admin', function (req, res) {
  if(req.session.isAdmin == true) {
    res.sendFile('/_admin_page.html', {root: 'static_admin'});
  }
  res.sendStatus(403);
});

// get /manage/userlist

// post /usersettings

router.get('/getuserdata', function(req,res) {
  let userInfo = {
    isLoggedIn: false,
    branches: [],
    currOrg: 0,
    currOrgName: "",
    memberOrg: 0
  };
  if (req.session.userID) {
    userInfo.isLoggedIn = true;
    req.pool.getConnection(function (err, connection) {
      if (err) {
        //console.log(err);
        res.sendStatus(500);
        return;
      }
      var query = "SELECT memberList.orgID FROM memberList WHERE memberList.userID = ?;";
      connection.query(query, [req.session.userID], function (error, rows, fields) {
        connection.release();
        if (error) {
          //console.log(rows);
          res.sendStatus(500);
          return;
        }
        req.session.memberOrg = rows[0];
        userInfo.memberOrg = rows[0];
      });
    });
  } else {
    userInfo.isLoggedIn = false;
  }
  req.pool.getConnection(function (err, connection) {
    if (err) {
      //console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT orgID, branchName FROM organisations;";
    connection.query(query, function (error, rows, fields) {
      connection.release();
      if (error) {
        //console.log(rows);
        res.sendStatus(500);
        return;
      }
      for(var i = 0; i < Object.keys(rows).length; i++) {
        let branch = {
          orgID: "0",
          branchName: ""
        };
        branch.orgID = rows[i].orgID;
        branch.branchName = rows[i].branchName;
        userInfo.branches.push(branch);
        userInfo.currOrg = req.session.currOrg;
        if(i+1 == req.session.currOrg) {
          userInfo.currOrgName = rows[i].branchName;
        }
      }
      // console.log(userInfo);
      res.json(JSON.stringify(userInfo));
      });
  });
});

router.post('/changebranch', function (req,res) {
  var orgID = req.query.currOrg;
  req.session.currOrg = orgID;
  res.sendStatus(200);
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

module.exports = router;
