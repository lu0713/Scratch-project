const db = require("../models/models.js"); // remove after testing

const queries = {};


queries.getAllEvents = `
SELECT * FROM events
`;

// GET USER'S EVENTS
queries.userEvents = `
SELECT * FROM usersandevents WHERE userid=$1
`;

// let minchanuserid = [1];
// db.query(queries.userEvents, minchanuserid).then(data => console.log(data.rows));

// GET ALL USER'S PERSONAL INFO
queries.userInfo = `SELECT * FROM users WHERE username=$1`; // const values = [req.query.id]

// let minchanusername = ['minchanjun@gmail.com'];
// db.query(queries.userInfo, minchanusername).then(data => console.log(data.rows));


// QUERY TO ADD USER
queries.addUser = `
INSERT INTO users
  (username, firstname, lastname, profilephoto)
VALUES($1, $2, $3, $4)
RETURNING username
;
`;

// let addMinchan = ['minchanjun@gmail.com', 'minchan', 'jun', 'photo TBD'];
// db.query(queries.addUser, addMinchan).then(data => console.log(data.rows));

// let addMarc = ['marcaburnie@gmail.com', 'marc', 'burnie', 'photo TBD'];
// db.query(queries.addUser, addMarc).then(data => console.log(data.rows));




// QUERY FOR WHEN USER CREATES EVENT 
queries.createEvent = `
INSERT INTO events
  (eventtitle, eventdate, eventstarttime, eventendtime, eventlocation, eventdetails, eventownerid, eventownerusername, eventmessages)
VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING eventid
;
`;

// let minchanBirthday = ['minchan birthday', '9/15/2020', '06:00 PM', '09:00 PM', 'golf course', 'play minigolf birthday', 1, 'minchanjun@gmail.com', "{'hey when is it again', 'happy birthday!', 'sorry can\'t make it'}"]
// db.query(queries.createEvent, minchanBirthday).then(data => console.log(data.rows));

// let minchanWedding = ['minchan wedding', '10/1/2020', '02:00 PM', '03:00 PM', 'castle', 'attend wedding', 1, 'minchanjun@gmail.com', "{'so excited for your wedding!', 'loving the location', 'sorry can\'t make it'}"]
// db.query(queries.createEvent, minchanWedding).then(data => console.log(data.rows));

// let marcBirthday = ['marc birthday', '1/16/2021', '01:00 PM', '02:00 PM', 'dave n buster', 'arcade games', 2, 'marcaburnie@gmail.com', "{'congrats', 'happy bussdayyy', 'sorry don\'t think i make it'}"]
// db.query(queries.createEvent, marcBirthday).then(data => console.log(data.rows));



// ============== BELOW TESTS DON'T ACCOUNT FOR MESSSAGES ===============
// let marcBirthday = ['marc birthday', '9/1/2020', '02:00 PM', '08:00 PM', 'Mohegan Sun', 'birthday parteeee', 2, 'marc123']
// let stellaWedding = ['stella wedding', '2/3/2021', '05:00 PM', '08:00 PM', 'Castle in Ireland', 'weddingggg', 1, 'stella123']
// let stellaBirthday = ['stella birthday', '2/3/2021', '02:00 PM', '04:00 PM', 'Bunny Bunny', 'bussday', 1, 'stella123'];
// db.query(queries.createEvent, marcBirthday).then(data => console.log(data.rows));
// db.query(queries.createEvent, stellaWedding).then(data => console.log(data.rows));;
// db.query(queries.createEvent, stellaBirthday).then(data => console.log(data.rows));;



// ADDS ALL CURRENT EVENTS TO USERSANDEVENTS
queries.addNewEventToJoinTable = `
INSERT INTO usersandevents (userid, username, eventid, eventtitle, eventdate, eventstarttime, eventendtime, eventdetails, eventlocation)
SELECT eventownerid, eventownerusername, eventid, eventtitle, eventdate, eventstarttime, eventendtime, eventdetails, eventlocation FROM events
RETURNING usersandevents;
`;

// db.query(queries.addNewEventToJoinTable).then(data => console.log(data.rows));


// USERS ADDS THEMSELVES TO OTHER PEOPLE'S EVENTS
queries.addUserToEvent = `INSERT INTO usersandevents
  (userid, username, eventid, eventtitle, eventdate, eventstarttime, eventendtime, eventdetails, eventlocation)
VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING eventid
;
`;
// let marcAttendingMinchanBirthday = [2, 'marcaburnie@gmail.com', 1, 'minchan birthday', '2020-09-15', '18:00:00', '21:00:00', 'play minigolf birthday', 'golf course'];
// db.query(queries.addUserToEvent, marcAttendingMinchanBirthday).then(data => console.log(data.rows));;

// let marcAttendingMinchanWedding = [2, 'marcaburnie@gmail.com', 2, 'minchan wedding'];
// db.query(queries.addUserToEvent, marcAttendingMinchanWedding).then(data => console.log(data.rows));;


// USER POSTS COMMENTS ON EVENT
queries.addComment = `
INSERT INTO events
VALUES(eventmessages, '{$1}')
RETURNING eventmessages
;
`;

// GRAB EVENT'S ATTENDEES
queries.selectEventAttendees = `SELECT * FROM usersandevents WHERE eventtitle=$1`;

let minchanWeddingTitle = ['minchan wedding'];
db.query(queries.selectEventAttendees, minchanWeddingTitle).then(data => console.log(data.rows));










// QUERY TO DELETE EVENT
queries.deleteEvent = `
DELETE FROM usersandevents WHERE eventid=$1;
DELETE FROM events WHERE eventid=$1;
`;

// let minchanWeddingEventId = [3];
// db.query(queries.deleteEvent, minchanWeddingEventId).then(data => console.log(data.rows));



// DELETE USER ====== need to fix ==========
queries.deleteUser = `
  DELETE FROM usersandevents WHERE userid=$1;
  DELETE FROM events WHERE eventownerid=$1;
  DELETE FROM users WHERE userid=$1;
`;














// CLEAR ALL TABLES & DATA
queries.clearAll = `
DROP TABLE usersandevents;
DROP TABLE events;
DROP TABLE users;
`;

module.exports = queries;