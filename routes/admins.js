var express = require('express');
var router = express.Router();

/* routes related to branches */

router.get('/', function(req, res, next) {
  if(req.session.isAdmin == false || req.session.isAdmin == 'false') {
    res.sendStatus(403);
    return;
  }
  res.sendFile('/_admin_page.html', {root: 'static_admin'});
});

router.post('/createBranch', function(req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    var query = "INSERT INTO organisations (branchName, branchAddress, managerID) VALUES (?, ?, ?);";

    connection.query(query, [req.body.state, req.body.location, req.body.manager], function (error) {
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

router.get('/getBranches', function(req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    var query = "SELECT organisations.branchName, organisations.branchAddress, users.firstName, users.lastName FROM organisations INNER JOIN users ON organisations.managerID = users.userID;";

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

router.get('/count', function(req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT (SELECT COUNT(*) FROM organisations) branchCount, (SELECT COUNT(*) FROM users WHERE isManager = TRUE) managerCount, (SELECT COUNT(*) FROM events) eventCount, (SELECT COUNT(*) FROM users) userCount;";
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

router.get('/getUsers', function(req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT users.firstName, users.lastName, users.isAdmin, users.isManager, organisations.branchName, users.DOB, users.email, users.phonenumber FROM organisations INNER JOIN memberList ON organisations.orgID = memberList.orgID RIGHT JOIN users ON memberList.userID = users.userID;";

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

router.post('/addUser', function(req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    let isAdmin = 0;
    let isManager = 0;
    if(req.body.role == "Admin") {
      isAdmin = 1;
    }
    if(req.body.role == "Manager") {
      isManager = 1;
    }

    var query = "INSERT INTO users (firstName, lastName, isAdmin, isManager, email, passcode) VALUES (?, ?, ?, ?, ?, '$argon2id$v=19$m=65536,t=3,p=1$ZjFzMUlZWUJIZ2JyZlZxdA$ApIG5XcHXFWeudpRVQLvp81jdAuADAJWHC7jSDGtrAY')";
    connection.query(query, [req.body.firstName, req.body.lastName, isAdmin, isManager, req.body.email], function (error) {
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

router.post('/promoteUser', function(req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    let newIsAdmin = 0;
    let newIsManager = 0;
    if(req.body.isAdmin) {
      res.sendStatus(200);
    }
    if(req.body.isManager) {
      newIsAdmin = 1;
    }
    else {
      newIsManager = 1;
    }

    var query = "UPDATE users SET isAdmin = ?, isManager = ? WHERE email = ?;";
    connection.query(query, [newIsAdmin, newIsManager, req.body.email], function (error) {
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

router.get('/getManagers', function(req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT users.userID, users.firstName, users.lastName FROM users LEFT JOIN organisations ON users.userID = organisations.managerID WHERE organisations.managerID IS NULL AND users.isManager = 1;";

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

router.post('/searchUsers', function(req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    var query = "SELECT firstName, lastName, email, isAdmin, isManager FROM users WHERE CONCAT(firstName, ' ', lastName) LIKE ? OR email LIKE ?;";

    connection.query(query, ['%' + req.body.searchTerm + '%', '%' + req.body.searchTerm + '%'], function (error, rows) {
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

router.post('/deleteUser', function(req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    var query = "DELETE FROM users WHERE email = ?;";
    connection.query(query, [req.body.email], function (error) {
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

module.exports = router;