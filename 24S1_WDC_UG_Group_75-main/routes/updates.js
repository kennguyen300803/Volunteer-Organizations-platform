var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  // console.log(req.session.isAdmin + " " + req.session.isManager);
  if((req.session.isAdmin == true) || (req.session.isManager == true)) {
    res.sendFile('/_manager_page.html', {root: 'static_posts'});
  } else if (req.session.userID) {
    res.sendFile('/_user_page.html', {root: 'static_posts'});
  } else {
    res.sendFile('/_public_page.html', {root: 'static_posts'});
  }
});

/* GET updates listing. */
// this needs to send different queries based on if the user if authenticated or not
router.get('/get_updates', function(req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query;
    if(!(req.session.userID) || (req.session.userID)) {
      query = "SELECT postTopic, postBody, isPublic, updateTS FROM updatePost WHERE orgID = ? AND isPublic = TRUE;";
    } else {
      query = "SELECT postTopic, postBody, isPublic, updateTS FROM updatePost WHERE orgID = ?;";
    }
    connection.query(query, [req.session.currOrg], function (error, rows, fields) {
      connection.release();
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      res.send(rows);
    });
  });
});

// post /create_update
router.post('/create_update', function(req, res, next){
  console.log(req.body);
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "INSERT INTO updatePost (orgID, postTopic, postBody, isPublic) VALUES (?, ?, ?, 1);";
    connection.query(query, [req.body.orgID, req.body.postTopic, req.body.postBody], function (error, rows, fields) {
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

// post /edit_update
/*router.post('/edit_update', function(req, res, next){
  var orgID;
  if((req.session.isManager == false)) { // prevents non-managers from submitting
    res.sendStatus(403);
    return;
  }
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT organisations.orgID FROM organisations INNER JOIN users WHERE organisations.managerID = ?;";
    connection.query(query, [req.session.userID], function (error, rows, fields) {
      connection.release();
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      if(!(rows)) { // prevents non-managers from submitting who AREN'T assigned (normal form failure)
        res.sendStatus(403);
        return;
      }
      orgID = rows;
      console.log(orgID);
    });
  });
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "UPDATE updatePost SET postTopic = ?, postBody = ?, isPublic = ? WHERE updateID = ? AND orgID = ?;";
    connection.query(query, [req.body.postTopic, req.body.postBody, req.body.isPublic, req.body.updateID, orgID], function (error, rows, fields) {
      connection.release();
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});*/


module.exports = router;