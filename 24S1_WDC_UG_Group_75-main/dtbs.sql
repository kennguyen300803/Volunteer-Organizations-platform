DROP SCHEMA IF EXISTS dtbs;
CREATE SCHEMA dtbs;
USE dtbs;

-- Table for Users
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  userID INT NOT NULL AUTO_INCREMENT,
  firstName VARCHAR(20),
  lastName VARCHAR(20),
  DOB DATE,
  email VARCHAR(255) NOT NULL,
  phonenumber VARCHAR(15),
  passcode VARCHAR(160) NOT NULL,
  isAdmin BOOLEAN DEFAULT 0,
  isManager BOOLEAN DEFAULT 0,
  PRIMARY KEY (userID),
  UNIQUE KEY email (email)
);

-- Table for Organisations
DROP TABLE IF EXISTS organisations;
CREATE TABLE organisations (
  orgID INT(10) AUTO_INCREMENT,
  branchName VARCHAR(20) NOT NULL,
  branchAddress VARCHAR(300),
  managerID INT(10),
  PRIMARY KEY (orgID),
  FOREIGN KEY (managerID) REFERENCES users(userID) ON DELETE SET NULL,
  UNIQUE KEY managerID (managerID)
);

-- Table for Events
DROP TABLE IF EXISTS events;
CREATE TABLE events (
  eventID INT(10) AUTO_INCREMENT,
  eventDescription VARCHAR(300),
  eventDate DATE DEFAULT (CURDATE()),
  orgID INT(10),
  eventTitle VARCHAR(50),
  PRIMARY KEY (eventID, orgID),
  FOREIGN KEY (orgID) REFERENCES organisations(orgID) ON DELETE CASCADE
);

-- Table for Linked Accounts
-- DROP TABLE IF EXISTS linkedAccounts;
-- CREATE TABLE linkedAccounts (
--   externalLogin VARCHAR(20) NOT NULL,
--   userID INT(10),
--   PRIMARY KEY (externalLogin, userID),
--   FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
-- );

-- Table for Mailing List
DROP TABLE IF EXISTS mailingList;
CREATE TABLE mailingList (
  userID INT(10),
  orgID INT(10),
  isUpdate BOOLEAN DEFAULT FALSE,
  isSpecialEvent BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (userID, orgID),
  FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE,
  FOREIGN KEY (orgID) REFERENCES organisations(orgID) ON DELETE CASCADE
);

-- Table for RSVP
DROP TABLE IF EXISTS rsvp;
CREATE TABLE rsvp (
  userID INT(10),
  eventID INT(10),
  PRIMARY KEY (userID, eventID),
  FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE,
  FOREIGN KEY (eventID) REFERENCES events(eventID) ON DELETE CASCADE
);

-- Table for Members List - this puts us at like the -1th form but like what r we gonna do we had to scale back
DROP TABLE IF EXISTS memberList;
CREATE TABLE memberList (
  userID INT(10),
  orgID INT(10),
  PRIMARY KEY (userID, orgID),
  FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE,
  FOREIGN KEY (orgID) REFERENCES organisations(orgID) ON DELETE CASCADE,
  UNIQUE KEY userID (userID)
);

-- Table for Updates
DROP TABLE IF EXISTS updatePost;
CREATE TABLE updatePost (
  updateTS TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updateID INT(10) AUTO_INCREMENT,
  orgID INT(10),
  postTopic VARCHAR(50),
  postBody VARCHAR(300),
  isPublic BOOLEAN DEFAULT 1,
  PRIMARY KEY (updateID, orgID),
  FOREIGN KEY (orgID) REFERENCES organisations(orgID) ON DELETE CASCADE
);

-- Populating the Users table
INSERT INTO users (firstName, lastName, DOB, email, phonenumber, passcode, isAdmin, isManager) VALUES
-- Admin
('Big', 'Man', STR_TO_DATE('01/01/1970', '%d/%m/%Y'), 'admin@example.com', '0123456789', '$argon2id$v=19$m=65536,t=3,p=1$ZjFzMUlZWUJIZ2JyZlZxdA$ApIG5XcHXFWeudpRVQLvp81jdAuADAJWHC7jSDGtrAY', TRUE, FALSE),

-- Managers
('Ken', 'Nguyen', STR_TO_DATE('01/01/1980', '%d/%m/%Y'), 'john.doe@nsw.com', '0123456781', '$argon2id$v=19$m=65536,t=3,p=1$ZjFzMUlZWUJIZ2JyZlZxdA$ApIG5XcHXFWeudpRVQLvp81jdAuADAJWHC7jSDGtrAY', FALSE, TRUE),
('Micheal', 'Chandler', STR_TO_DATE('01/03/1982', '%d/%m/%Y'), 'jim.brown@qld.com', '0123456783', '$argon2id$v=19$m=65536,t=3,p=1$ZjFzMUlZWUJIZ2JyZlZxdA$ApIG5XcHXFWeudpRVQLvp81jdAuADAJWHC7jSDGtrAY', FALSE, TRUE),
('Dustin', 'Poirier', STR_TO_DATE('01/05/1984', '%d/%m/%Y'), 'jill.black@sa.com', '0123456785', '$argon2id$v=19$m=65536,t=3,p=1$ZjFzMUlZWUJIZ2JyZlZxdA$ApIG5XcHXFWeudpRVQLvp81jdAuADAJWHC7jSDGtrAY', FALSE, TRUE),

-- Other users
('Ace', 'One', STR_TO_DATE('01/01/1990', '%d/%m/%Y'), 'user1@example.com', '0123456787', '$argon2id$v=19$m=65536,t=3,p=1$ZjFzMUlZWUJIZ2JyZlZxdA$ApIG5XcHXFWeudpRVQLvp81jdAuADAJWHC7jSDGtrAY', FALSE, FALSE),
('Le', 'Two', STR_TO_DATE('01/02/1991', '%d/%m/%Y'), 'user2@example.com', '0123456788', '$argon2id$v=19$m=65536,t=3,p=1$ZjFzMUlZWUJIZ2JyZlZxdA$ApIG5XcHXFWeudpRVQLvp81jdAuADAJWHC7jSDGtrAY', FALSE, FALSE),
('Tim', 'Three', STR_TO_DATE('01/03/1992', '%d/%m/%Y'), 'user3@example.com', '0123456789', '$argon2id$v=19$m=65536,t=3,p=1$ZjFzMUlZWUJIZ2JyZlZxdA$ApIG5XcHXFWeudpRVQLvp81jdAuADAJWHC7jSDGtrAY', FALSE, FALSE),
('Alex', 'Four', STR_TO_DATE('01/04/1993', '%d/%m/%Y'), 'user4@example.com', '0123456790', '$argon2id$v=19$m=65536,t=3,p=1$ZjFzMUlZWUJIZ2JyZlZxdA$ApIG5XcHXFWeudpRVQLvp81jdAuADAJWHC7jSDGtrAY', FALSE, FALSE),
('Josh', 'Five', STR_TO_DATE('01/05/1994', '%d/%m/%Y'), 'user5@example.com', '0123456791', '$argon2id$v=19$m=65536,t=3,p=1$ZjFzMUlZWUJIZ2JyZlZxdA$ApIG5XcHXFWeudpRVQLvp81jdAuADAJWHC7jSDGtrAY', FALSE, FALSE),
('Eva', 'Six', STR_TO_DATE('01/06/1995', '%d/%m/%Y'), 'user6@example.com', '0123456792', '$argon2id$v=19$m=65536,t=3,p=1$ZjFzMUlZWUJIZ2JyZlZxdA$ApIG5XcHXFWeudpRVQLvp81jdAuADAJWHC7jSDGtrAY', FALSE, FALSE),
('Sam', 'Seven', STR_TO_DATE('01/07/1996', '%d/%m/%Y'), 'user7@example.com', '0123456793', '$argon2id$v=19$m=65536,t=3,p=1$ZjFzMUlZWUJIZ2JyZlZxdA$ApIG5XcHXFWeudpRVQLvp81jdAuADAJWHC7jSDGtrAY', FALSE, FALSE),
('Lily', 'Eight', STR_TO_DATE('01/08/1997', '%d/%m/%Y'), 'user8@example.com', '0123456794', '$argon2id$v=19$m=65536,t=3,p=1$ZjFzMUlZWUJIZ2JyZlZxdA$ApIG5XcHXFWeudpRVQLvp81jdAuADAJWHC7jSDGtrAY', FALSE, FALSE),
('Ryan', 'Nine', STR_TO_DATE('01/09/1998', '%d/%m/%Y'), 'user9@example.com', '0123456795', '$argon2id$v=19$m=65536,t=3,p=1$ZjFzMUlZWUJIZ2JyZlZxdA$ApIG5XcHXFWeudpRVQLvp81jdAuADAJWHC7jSDGtrAY', FALSE, FALSE),
('Zoe', 'Ten', STR_TO_DATE('01/10/1999', '%d/%m/%Y'), 'user10@example.com', '0123456796', '$argon2id$v=19$m=65536,t=3,p=1$ZjFzMUlZWUJIZ2JyZlZxdA$ApIG5XcHXFWeudpRVQLvp81jdAuADAJWHC7jSDGtrAY', FALSE, FALSE),
('Nick', 'Eleven', STR_TO_DATE('01/11/2000', '%d/%m/%Y'), 'user11@example.com', '0123456797', '$argon2id$v=19$m=65536,t=3,p=1$ZjFzMUlZWUJIZ2JyZlZxdA$ApIG5XcHXFWeudpRVQLvp81jdAuADAJWHC7jSDGtrAY', FALSE, FALSE),
('Tina', 'Twelve', STR_TO_DATE('01/12/2001', '%d/%m/%Y'), 'user12@example.com', '0123456798', '$argon2id$v=19$m=65536,t=3,p=1$ZjFzMUlZWUJIZ2JyZlZxdA$ApIG5XcHXFWeudpRVQLvp81jdAuADAJWHC7jSDGtrAY', FALSE, FALSE),
('Owen', 'Thirteen', STR_TO_DATE('01/01/2002', '%d/%m/%Y'), 'user13@example.com', '0123456799', '$argon2id$v=19$m=65536,t=3,p=1$ZjFzMUlZWUJIZ2JyZlZxdA$ApIG5XcHXFWeudpRVQLvp81jdAuADAJWHC7jSDGtrAY', FALSE, FALSE),
('Jack', 'Fourteen', STR_TO_DATE('01/02/2003', '%d/%m/%Y'), 'user14@example.com', '0123456800', '$argon2id$v=19$m=65536,t=3,p=1$ZjFzMUlZWUJIZ2JyZlZxdA$ApIG5XcHXFWeudpRVQLvp81jdAuADAJWHC7jSDGtrAY', FALSE, FALSE),
('Jill', 'Fifteen', STR_TO_DATE('01/03/2004', '%d/%m/%Y'), 'user15@example.com', '0123456801', '$argon2id$v=19$m=65536,t=3,p=1$ZjFzMUlZWUJIZ2JyZlZxdA$ApIG5XcHXFWeudpRVQLvp81jdAuADAJWHC7jSDGtrAY', FALSE, FALSE),
('Nina', 'Sixteen', STR_TO_DATE('01/04/2005', '%d/%m/%Y'), 'user16@example.com', '0123456802', '$argon2id$v=19$m=65536,t=3,p=1$ZjFzMUlZWUJIZ2JyZlZxdA$ApIG5XcHXFWeudpRVQLvp81jdAuADAJWHC7jSDGtrAY', FALSE, FALSE),
('Tom', 'Seventeen', STR_TO_DATE('01/05/2006', '%d/%m/%Y'), 'user17@example.com', '0123456803', '$argon2id$v=19$m=65536,t=3,p=1$ZjFzMUlZWUJIZ2JyZlZxdA$ApIG5XcHXFWeudpRVQLvp81jdAuADAJWHC7jSDGtrAY', FALSE, FALSE),
('Mia', 'Eighteen', STR_TO_DATE('01/06/2007', '%d/%m/%Y'), 'user18@example.com', '0123456804', '$argon2id$v=19$m=65536,t=3,p=1$ZjFzMUlZWUJIZ2JyZlZxdA$ApIG5XcHXFWeudpRVQLvp81jdAuADAJWHC7jSDGtrAY', FALSE, FALSE),
('Leo', 'Nineteen', STR_TO_DATE('01/07/2008', '%d/%m/%Y'), 'user19@example.com', '0123456805', '$argon2id$v=19$m=65536,t=3,p=1$ZjFzMUlZWUJIZ2JyZlZxdA$ApIG5XcHXFWeudpRVQLvp81jdAuADAJWHC7jSDGtrAY', FALSE, FALSE),
('Anna', 'Twenty', STR_TO_DATE('01/08/2009', '%d/%m/%Y'), 'user20@example.com', '0123456806', '$argon2id$v=19$m=65536,t=3,p=1$ZjFzMUlZWUJIZ2JyZlZxdA$ApIG5XcHXFWeudpRVQLvp81jdAuADAJWHC7jSDGtrAY', FALSE, FALSE);

-- Populating the Organisations table
INSERT INTO organisations (branchName, branchAddress, managerID) VALUES
('Sydney', '123 Sydney St, Sydney, NSW', 2),
('Brisbane', '456 Brisbane St, Brisbane, QLD', 3),
('Adelaide', '789 Adelaide St, Adelaide, SA', 4);

-- Populating the Events table
INSERT INTO events (eventDescription, eventDate, orgID, eventTitle) VALUES
('Annual Meeting', '2024-07-01', 1, 'Annual Meeting 2024'),
('Quarterly Review', '2024-08-15', 1, 'Quarterly Review Q3 2024'),
('Team Building', '2024-09-20', 2, 'Team Building Exercise'),
('Charity Event', '2024-11-10', 3, 'Charity Fundraiser'),
('Holiday Party', '2024-12-20', 1, 'Holiday Celebration'),
('Workshop', '2024-10-05', 2, 'Skills Workshop'),
('Networking Event', '2024-09-15', 3, 'Professional Networking');

-- Populating the Linked Accounts table
/*INSERT INTO linkedAccounts (externalLogin, userID) VALUES
('google_ken', 2),
('facebook_micheal', 3),
('linkedin_dustin', 4),
('google_ace', 5),
('facebook_le', 6),
('linkedin_tim', 7),
('google_alex', 8),
('facebook_josh', 9),
('linkedin_eva', 10),
('google_sam', 11),
('facebook_lily', 12),
('linkedin_ryan', 13); */

-- Populating the Mailing List table
INSERT INTO mailingList (userID, orgID, isUpdate, isSpecialEvent) VALUES
(5, 1, TRUE, FALSE),
(6, 1, TRUE, TRUE),
(7, 2, FALSE, TRUE),
(8, 3, TRUE, FALSE),
(9, 1, TRUE, TRUE),
(10, 2, FALSE, TRUE),
(11, 3, TRUE, FALSE);


-- Populating the RSVP table
INSERT INTO rsvp (userID, eventID) VALUES
(5, 1),
(6, 2),
(7, 3),
(8, 4),
(9, 5),
(10, 6),
(11, 1),
(12, 2),
(13, 3),
(14, 4),
(15, 5),
(16, 6),
(17, 1),
(18, 2),
(19, 3),
(20, 6);

-- Populating the Members List table
INSERT INTO memberList (userID, orgID) VALUES
(2,1),
(3,2),
(4,3),
(5, 1),
(6, 1),
(7, 2),
(8, 3),
(9, 2),
(10, 3),
(11, 3),
(12, 3);

-- Populating the Updates table
INSERT INTO updatePost (orgID, postTopic, postBody, isPublic) VALUES
(1, 'Welcome Post', 'Welcome to the Sydney Central Branch!', FALSE),
(2, 'Event Update', 'Team Building event is coming up soon!', FALSE),
(3, 'Fundraiser Success', 'Thanks for supporting the charity fundraiser!', TRUE),
(1, 'New Manager', 'Welcome our new manager!', TRUE),
(2, 'Product Launch', 'Join us for the new product launch!', TRUE),
(3, 'Open House', 'Come visit us at our open house event!', TRUE),
(1, 'Networking Opportunity', 'Network with professionals!', TRUE),
(2, 'Seminar Details', 'Attend our educational seminar!', TRUE),
(3, 'Holiday Party', 'Holiday celebration details!', FALSE),
(1, 'Workshop', 'Sign up for our skills workshop!', TRUE);