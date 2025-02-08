var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  console.log(req.session.isAdmin + " " + req.session.isManager);
  // console.log(req.session.isAdmin + " " + req.session.isManager + " " + req.session.userID);
  if((req.session.isAdmin == true) || (req.session.isManager == true)) {
    res.sendFile('/_manager_page.html', {root: 'static_events'});
  } else if (req.session.userID) {
    res.sendFile('/_user_page.html', {root: 'static_events'});
  } else {
    res.sendFile('/_public_page.html', {root: 'static_events'});
  }
});

/* GET events listing. */
// this needs to send different queries based on if the user if authenticated or not
router.get('/get_events', function(req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    // console.log(req.session.currOrg);
    var query  = "SELECT eventDate, eventTitle, eventDescription, eventID FROM events WHERE orgID = ?;";
    connection.query(query, [req.session.currOrg], function (error, rows, fields) {
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

//var orgID;
// post /create_event
router.post('/create_event', function(req, res, next){
  if((req.session.isManager == false) || !req.session.userID) { // prevents non-managers from submitting, check if signed in
    res.sendStatus(403);
    return;
  }
  /*req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    // var query = "SELECT organisations.orgID FROM organisations INNER JOIN users WHERE organisations.managerID = ?;";
    //console.log(req.session.userID);
    var query = "SELECT organisations.orgID FROM organisations WHERE organisations.managerID = ?;"; // match session userid to the relevant org
    connection.query(query, [req.session.userID], function (error, rows, fields) {
      connection.release();
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      if(!(rows)) { // prevents non-managers from submitting who AREN'T assigned (normal form failure - sorry!)
        res.sendStatus(403);
        return;
      }
      orgID = rows[0].orgID;
      //console.log(orgID + " " + rows[0].orgID);
    });
  });*/
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    console.log(req.body.orgID);
    var query = "INSERT INTO events (eventTitle, eventDescription, eventDate, orgID) VALUES (?, ?, ?, ?);";
    //console.log(orgID);
    connection.query(query, [req.body.eventTitle, req.body.eventDescription, req.body.eventDate, req.body.orgID], function (error, rows, fields) {
      connection.release();
      //orgID = 0;
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      emailData(req.body.eventTitle, req.body.eventDescription, req.body.orgID, req, res);
      res.sendStatus(200);
    });
  });
});

// post /edit_event
/*router.post('/edit_event', function(req, res, next){
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
      console.log(orgID[0]);
    });
  });
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "UPDATE events SET eventTitle = ?, eventDescription = ?, eventDate = ? WHERE eventID = ? AND orgID = ?;";
    connection.query(query, [req.body.eventTitle, req.body.eventDescription, req.body.eventDate, req.body.eventID, orgID[0]], function (error, rows, fields) {
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

router.get('/show_RSVP', function(req, res, next){
  if((req.session.isAdmin == false) && (req.session.isManager == false)) {
    res.sendStatus(403);
    return;
  }
  var eventID = req.query.event;
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT users.firstName, users.lastName, users.userID, rsvp.eventID FROM users INNER JOIN rsvp WHERE users.userID = rsvp.userID AND rsvp.eventID = ?;";
    connection.query(query, eventID, function (error, rows, fields) {
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

router.post('/remove_RSVP', function(req, res, next){
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    //console.log(req.body.userID);
    var query = "DELETE FROM rsvp WHERE userID = ? AND eventID;";
    connection.query(query, [req.body.userID, req.body.eventID], function (error, rows, fields) {
      connection.release();
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      //console.log(rows);
      res.sendStatus(200);
    });
  });
});

router.get('/get_joined_events', function(req, res, next){
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT events.eventTitle, events.eventID FROM events INNER JOIN rsvp WHERE rsvp.eventID = events.eventID AND rsvp.userID = ?;";
    connection.query(query, [req.session.userID], function (error, rows, fields) {
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

router.post('/going', function(req, res, next){
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    //console.log(req.body.userID);
    var query = "INSERT INTO rsvp (userID, eventID) VALUES (?, ?);";
    connection.query(query, [req.session.userID, req.body.eventID], function (error, rows, fields) {
      connection.release();
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      //console.log(rows);
      res.sendStatus(200);
    });
  });
});

router.post('/not_going', function(req, res, next){
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    //console.log(req.body.userID);
    var query = "DELETE FROM rsvp WHERE userID = ? AND eventID = ?;";
    connection.query(query, [req.session.userID, req.body.eventID], function (error, rows, fields) {
      connection.release();
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      //console.log(rows);
      res.sendStatus(200);
    });
  });
});

/* Email stuff */
var nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'noble.dickinson18@ethereal.email',
    pass: 'Yet8VdaJw4Rbru7jMt'
  }
});

function emailData(subject, text, orgID, req, res) { // we can email using this function by passing in the data
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    //console.log(req.body.userID);
    var query = "SELECT users.email FROM users INNER JOIN mailingList WHERE users.userID = mailingList.userID AND mailingList.orgID = ?;";
    connection.query(query, orgID, function (error, rows, fields) {
      connection.release();
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      // console.log(rows);
      //res.sendStatus(200);
      for(let i = 0; i < rows.length; i++){
        let message = transporter.sendMail({
          from: "noble.dickinson18@ethereal.email", // example email
          to: rows[i],
          subject: subject,
          text: text
        });
      }
    });
  });
}

module.exports = router;