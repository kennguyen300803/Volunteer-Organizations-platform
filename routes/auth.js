var express = require('express');
var router = express.Router();

const CLIENT_ID = '150162233083-bv7fto1hisfke2n3ban9npcmrnuj588q.apps.googleusercontent.com';
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

const argon2 = require('argon2');
const { MAX_ACCESS_BOUNDARY_RULES_COUNT } = require('google-auth-library/build/src/auth/downscopedclient');
// const { path } = require('../app');


router.get('/signin*', function (req, res) {
    if(req.session.userID) {
      res.redirect('back');
    }
    res.sendFile('signin.html', {root: 'static_user'});
});

router.get('/signup*', function (req, res) {
if(req.session.userID) {
    res.redirect('back');
}
res.sendFile('signup.html', {root: 'static_user'});
});

router.get('/profile.html', function (req, res) {
if(!req.session.userID) {
    res.redirect('back');
}
res.sendFile(req.originalUrl, {root: 'static_user'});
});

// Basic login function example with google integration
router.post('/login', async function (req, res, next) {
// Handles google login
if ('client_id' in req.body && 'credential' in req.body) {

    const ticket = await client.verifyIdToken({
    idToken: req.body.credential,
    audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //console.log(payload['sub']);
    console.log(payload['email']);
    // If the request specified a Google Workspace domain:
    // const domain = payload['hd'];

    // Search for user by email
    req.pool.getConnection(function (err, connection) {
    if (err) {
        // res.sendStatus(500);
        return;
    }
    var query = "SELECT DISTINCT userID, email, isAdmin, isManager FROM users WHERE email = ?;";
    connection.query(query, [payload['email']], function (error, rows, fields) {
        connection.release();
        if (error) {
        // res.sendStatus(500);
        console.log(error);
        return;
        }
        console.log(rows);
        if(!rows.email) {
        res.sendStatus(401);
        console.log("1");
        return;
        } else if (rows[0].email === payload['email']) {
        console.log("successge");
        req.session.userID = rows[0].userID;
        req.session.isAdmin = rows[0].isAdmin;
        req.session.isManager = rows[0].isManager;
        res.json(req.session.userID);
        return;
        }
    });
    });
    // No user
} else if ('email' in req.body && 'password' in req.body) { // Handles regular login
    if(!req.body.email || !req.body.password) {
    res.sendStatus(401);
    return;
    }
    req.pool.getConnection(function (err, connection) {
    if (err) {
        res.sendStatus(500);
        return;
    }
    var query = "SELECT DISTINCT userID, passcode, isAdmin, isManager FROM users WHERE email = ?;";
    connection.query(query, [req.body.email], async function (error, rows, fields) {
        connection.release();
        if (error) {
        res.sendStatus(500);
        return;
        }
        try {
        // console.log(rows[0].passcode + " | " + req.body.password);
        if (await argon2.verify(rows[0].passcode, req.body.password)) {
            // password match
            req.session.userID = rows[0].userID;
            req.session.isAdmin = rows[0].isAdmin;
            req.session.isManager = rows[0].isManager;
            res.json(req.session.userID);
            return;
        } else {
            // password did not match
            res.sendStatus(401);
            return;
        }
        } catch (err) {
        // internal failure
        }
    });
    });
} else {
    console.log("2");
    res.sendStatus(401);
    return;
}

});

// try to set
//   userID INT NOT NULL AUTO_INCREMENT,
//   firstName VARCHAR(20),
//   lastName VARCHAR(20),
//   DOB DATE,
//   email VARCHAR(255) NOT NULL,
//   phonenumber VARCHAR(15),
//   passcode VARCHAR(160) NOT NULL,
const asyncSignupHelper = async (req, res) => {
//console.log(req.body);
try {
    const hash = await argon2.hash(req.body.password);
    //console.log(hash);
    req.pool.getConnection(function (err, connection) {
    if (err) {
        //console.log(err);
        res.sendStatus(500);
        return;
    }
    var query = "INSERT INTO users (firstName, lastName, DOB, email, phonenumber, passcode) VALUES (?,?,?,?,?,?);";
    var input = req.body;
    connection.query(query, [input.firstName, input.lastName, input.birthDate, input.email, input.phonenumber, hash], function (error, rows, fields) {
        connection.release();
        if (error) {
        //console.log(rows);
        res.sendStatus(500);
        return;
        }
    });
    }); // dont need to do res.send() since res.json sends it (sweet)
} catch (err) {
    console.log("hash failed");
}
}

router.post('/signup_form', function (req, res, next) {
if (!req.body.email) { // email already in table OR email not given
    res.sendStatus(401);
} else if (Object.keys(req.body.password).length <= 8) {
    res.status(401).send('password too short');
    return;
} else {
    asyncSignupHelper(req, res);
    //console.log(req.body.email);
    res.end();
}
next();
});

router.post('/logout', function (req, res, next) {
if ('userID' in req.session) {
    delete req.session.userID;
    delete req.session.isAdmin;
    delete req.session.isManager;
    req.session.regenerate(function (err) {
    if (err) next(err)});
    res.redirect('/');
} else {
    res.sendStatus(403);
}
});


module.exports = router;