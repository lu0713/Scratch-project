const db = require("../models/models");
const queries = require("../utils/queries");
const e = require("express");
const eventController = {};

eventController.getFullEvents = (req, res, next) => {

  const queryString = queries.userEvents;
  const queryValues = [res.locals.allUserInfo.userid]; //user will have to be verified Jen / Minchan
  db.query(queryString, queryValues)
    .then(data => {
      if (!data.rows[0]) {
        res.locals.allEventsInfo = [];
      } else {
        res.locals.allEventsInfo = data.rows;
      }
      return next();
    })
    .catch(err => {
      return next({
        log: `Error occurred with queries.userEvents OR eventController.getFullEvents middleware: ${err}`,
        message: { err: "An error occured with SQL when retrieving events information." },
      });
    })
};

eventController.getAllAttendees = async (req, res, next) => {
  const allEvents = res.locals.allEventsInfo; // ALL EVENTS FOR THAT USER
  const arrayOfEventTitles = []; // ['marc birthday', 'minchan birthday' ... ]
  for (const event of allEvents) {
    arrayOfEventTitles.push(event.eventtitle);
  }

  res.locals.attendees = [];
  const queryString = queries.selectEventAttendees;

  const promises = [];

  for (let i = 0; i < arrayOfEventTitles.length; i++) {
    const result = new Promise((resolve, reject) => {
      try {
        const queryResult = db.query(queryString, [arrayOfEventTitles[i]]);
        return resolve(queryResult)
      } catch (err) {
        return reject(err);
      }
    })
    promises.push(result);
  }

  const resolvedPromises = Promise.all(promises)
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        const container = [];
        data[i].rows.forEach(obj => {
          container.push(obj.username);
        })
        res.locals.attendees.push(container);
      }
      return next();
    })
    .catch(err => console.log('promise.all err: ', err));

  // const resolvedPromises = Promise.all(promises)
  // .then(data => {
  //   for(let i = 0; i < data.length; i++ ) {
  //     console.log('data: ', data[i].rows);
  //     res.locals.attendees.push(data[i].rows);
  //     console.log('RES.LOCALS.ATTENDEES: ', res.locals.attendees);
  //   }
  //   return next();
  // })
  // .catch(err => console.log('promise.all err: ', err));
}

eventController.createEvent = (req, res, next) => {
  // const { eventtitle, eventdate, eventstarttime, eventendtime, eventlocation, eventdetails } = req.body;
  const { userid, username } = res.locals.allUserInfo;

  const queryString = queries.createEvent;
  // const queryValues = [ eventtitle, eventdate, eventstarttime, eventendtime, eventlocation, eventdetails, userid, username, [] ];
  // <<<<<<< HEAD
  //   const queryValues = ['minchan birthday', '9/15/2020', '06:00 PM', '09:00 PM', 'golf course', 'play minigolf birthday', userid, username, "{'hey when is it again', 'happy birthday!', 'sorry can\'t make it'}"]
  //   db.query(queryString, queryValues)
  //     .then(data => {
  // =======
  // const queryValues = ['minchan birthday', '9/15/2020', '06:00 PM', '09:00 PM', 'golf course', 'play minigolf birthday', userid, username, "{}"]
  let { eventtitle, eventlocation, eventdate, eventstarttime, eventdetails } = req.body;
  console.log('eventController.createEvent ', req.body);
  const queryValues = [eventtitle, eventdate, eventstarttime, eventstarttime, eventlocation, eventdetails, userid, username, "{}"];
  db.query(queryString, queryValues)
    .then(data => {
      console.log('>>> eventController.createEvent DATA ', data);
      res.locals.eventID = data.rows[0];
      return next();
    })
    .catch(err => {
      console.log('>>> eventController.createEvent ERR ', err);
      return next({
        log: `Error occurred with queries.createEvent OR eventController.createEvent middleware: ${err}`,
        message: { err: "An error occured with SQL when creating event." },
      });
    })
};

eventController.addNewEventToJoinTable = (req, res, next) => {
  console.log('eventController.addNewEventToJoinTable')
  const queryString = queries.addNewEventToJoinTable;
  const queryValues = [res.locals.eventID.eventid]
  db.query(queryString, queryValues)
    .then(data => {
      res.locals.usersandevents = data.rows[0];
      return next();
    })
    .catch(err => {
      console.log('>>> eventController.addNewEventToJoinTable ERR', err);
      return next({
        log: `Error occurred with queries.addtoUsersAndEvents OR eventController.addNewEventToJoinTable middleware: ${err}`,
        message: { err: "An error occured with SQL when adding to addtoUsersAndEvents table." },
      });
    })
};

eventController.verifyAttendee = (req, res, next) => {
  const title = req.query.eventtitle; // verify with frontend

  const { username } = res.locals.allUserInfo

  const queryString = queries.selectEventAttendees;
  const queryValues = [title];

  db.query(queryString, queryValues)
    .then(data => {
      console.log('data: ', data);
      const attendees = [];
      for (const attendeeObj of data.rows) {
        attendees.push(attendeeObj.username);
      }
      console.log(attendees);
      if (attendees.includes(username)) {
        return next({
          log: `Error: User is already an attendee`,
          message: { err: "User is already an attendee" },
        });
      } else {
        res.locals.eventID = data.rows[0].eventid;
        res.locals.eventTitle = data.rows[0].eventtitle;
        res.locals.eventDate = data.rows[0].eventdate;
        res.locals.eventStartTime = data.rows[0].eventstarttime;
        res.locals.eventEndTime = data.rows[0].eventendtime;
        res.locals.eventDetails = data.rows[0].eventdetails;
        res.locals.eventLocation = data.rows[0].eventlocation;
        return next();
      }
    })
    .catch(err => {
      return next({
        log: `Error occurred with queries.selectEventAttendees OR eventController.verifyAttendee middleware: ${err}`,
        message: { err: "An error occured with SQL when verifying if user attended said event." },
      });
    })
}

//  (userid, username, eventid, eventtitle, eventdate, eventstarttime, eventendtime, eventdetails, eventlocation)
eventController.addAttendee = (req, res, next) => {
  const title = req.query.eventtitle

  const { userid, username } = res.locals.allUserInfo
  // eventsID is saved in res.locals.eventID

  const queryString = queries.addUserToEvent;
  const queryValues = [
    userid,
    username,
    res.locals.eventID,
    title,
    res.locals.eventDate,
    res.locals.eventStartTime,
    res.locals.eventEndTime,
    res.locals.eventDetails,
    res.locals.eventLocation,
  ];

  db.query(queryString, queryValues)
    .then(data => {
      console.log('data from addAttendee: ', data);
      return next();
    })
    .catch(err => {
      return next({
        log: `Error occurred with queries.addUserToEvent OR eventController.addAttendee middleware: ${err}`,
        message: { err: "An error occured with SQL adding a user to an existing event as an attendee." },
      });
    })
};

// eventController.allEvents = (req, res, next) => {

//   const queryString = queries.getAllEvents;

//   db.query(queryString)
//     .then(data => {
//       if (!data.rows) {
//         res.locals.allEventsInfo = [];
//       } else {
//         console.log('eventData', data.rows)
//         const eventAndUserDataQueryString = queries.getAttendeeEvents;
//         db.query(eventAndUserDataQueryString).then(eventAndUserData => {
//           console.log('eventAndUserData', eventAndUserData.rows)
//           const mergedTable = data.rows.map(e => {
//             const attendees = eventAndUserData.rows.filter(entry => entry.eventid == e.eventid)
//             e.attendees = attendees;
//             return e;
//           })
//           res.locals.allEventsInfo = mergedTable
//           console.log("merged table", res.locals.allEventsInfo)
//           return next();
//         })
//       }

//     })
//     .catch(err => {
//       return next({
//         log: `Error occurred with queries.getAllEvents OR eventController.allEvents middleware: ${err}`,
//         message: { err: "An error occured with SQL when retrieving all events information." },
//       });
//     })
// };

eventController.allEvents = async (req, res, next) => {
  res.local.allEventsInfo = [];

  try {
    const queryString1 = queries.getAllEvents;
    const queryString2 = queries.getEventAllAttendees;
    const queryString3 = queries.getEventMessages;
    const events = await db.query(queryString1)
    const attendees = await db.query(queryString2)
    const messages = await db.query(queryString3)

    console.log('events: ', events);
    console.log('attendees: ', attendees);
    console.log('messages: ', messages);

    events.forEach((event, i) => {
      const eventAttendeeList = attendees.filter(entry => entry.eventid === event.eventid);
      event.attendees = eventAttendeeList;

      const eventMessageList = messages.filter(entry => entry.eventid === event.eventid);
      event.content = eventMessageList
    })

    console.log('events after insertion of attendees & messages: ', events);
    res.locals.allEventsInfo = events;
    console.log("merged table", res.locals.allEventsInfo)
    return next();
  } catch (err) {
    return next({
      log: `Error occurred with queries.getAllEvents OR eventController.allEvents middleware: ${err}`,
      message: { err: "An error occured with SQL when retrieving all events information." },
    });
  };
}


eventController.getUserDetail = (req, res, next) => {

  const countObj = []; // each element should how many attendees are for each event in succession;
  res.locals.attendees.forEach(arr => {
    countObj.push(arr.length);
  })

  const allUsernames = res.locals.attendees.flat(Infinity);
  console.log('FLATTENED USERNAMES', allUsernames);

  const queryString = queries.userInfo;

  const promises = [];

  for (let i = 0; i < allUsernames.length; i++) {
    const result = new Promise((resolve, reject) => {
      try {
        const queryResult = db.query(queryString, [allUsernames[i]]);
        return resolve(queryResult)
      } catch (err) {
        return reject(err);
      }
    })
    promises.push(result);
  }

  const resolvedPromises = Promise.all(promises)
    .then(data => {

      res.locals.userDetail = [];

      for (let i = 0; i < countObj.length; i += 1) {
        let turns = countObj[i]
        let count = 0;
        const container = [];
        while (count < turns) {
          const minchan = data.shift()
          container.push(minchan.rows[0]);
          count++;
        }
        res.locals.userDetail.push(container);
      }
      return next();
    })
    .catch(err => console.log('promise.all err: ', err));
}

eventController.consolidation = (req, res, next) => {
  const consolidatedEvents = { ...res.locals.allEventsInfo };
  res.locals.userDetail.forEach((arr, i) => {
    consolidatedEvents[i].attendees = arr;
  })
  return next();
}

eventController.filterForUser = (req, res, next) => {
  const { userid } = res.locals.allUserInfo

  const filtered = res.locals.allEventsInfo.filter(event => event.attendees.some(attendee => attendee.userid === userid))
  console.log("filtered", filtered)
  res.locals.allEventsInfo = filtered;
  return next();
}

eventController.getMessages = (req, res, next) => {

  /**
 * [
  {
    userid: 1,
    username: 'minchanjun@gmail.com',
    profilephoto: 'https://lh3.googleusercontent.com/a-/AOh14GiCfRjVHS4vAoB3p62KOZdaUAxP6UvDZVpBoNUU9g=s96-c',
    eventtitle: 'Minchan Birthday',
    messagetext: 'so excited to see everyone at my birthday',
    messagedate: 2020-08-18T04:00:00.000Z,
    messagetime: '10:00:01'
  },
  {
    userid: 4,
    username: 'lumie.song@gmail.com',
    profilephoto: 'https://lh3.googleusercontent.com/a-/AOh14Gg93pDy8jrAZOTlp5Q3LZP_nPEWTNSdfNYtII92=s96-c',
    eventtitle: 'Minchan Birthday',
    messagetext: 'Custom Message Text',
    messagedate: 2020-08-17T04:00:00.000Z,
    messagetime: '05:00:01'
  }
]
 */
  const queryString = queries.getAllEvents;
  db.query(queryString)
    .then(data => {
      if (!data.rows) {
        res.locals.allEventsInfo = [];
      } else {
        console.log('eventData', data.rows)
        const eventMessages = queries.getMessages;
        db.query(eventMessages)
          .then(eventMessageData => {
            console.log('eventMessageData', eventMessageData.rows)
            const newMergedTable = data.rows.map(messageObj => {
              const messages = eventMessageData.rows.filter(entry => entry.eventtitle == messageObj.eventtitle)
              messageObj.content = messages;
              return messageObj;
            });
            res.locals.allEventsInfo = newMergedTable
            console.log("merged table", res.locals.allEventsInfo)
            return next();
          })
      }
    })

    .catch(err => {
      return next({
        log: `Error occurred with queries.getAllEvents OR eventController.allEvents middleware: ${err}`,
        message: { err: "An error occured with SQL when retrieving all events information." },
      });
    })


  // let allEventTitles = [];
  // const allEvents = res.locals.allEventsInfo;

  // for (let i = 0; i < allEvents.length; i++) {
  //   allEventTitles.push(allEvents[i].eventtitle)
  // }
  // console.log('allEventTitles: ', allEventTitles);

  // for (let i = 0; i < allEventTitles.length; i++) {
  //   const queryString = queries.getMessages;
  //   const queryValues = [allEventTitles[i]];
  // }



  // let desiredEventObj;
  // let desiredEventObjIndex;

  // for (let j = 0; j < allEvents.length; j++) {
  //   let eventObj = allEvents[j];
  //   if (eventObj.eventtitle === eventtitle) {
  //     desiredEventObj = eventObj;
  //     console.log('desiredEventObj: ', desiredEventObj)
  //     desiredEventObjIndex = j;
  //     console.log('desiredEventObjIndex: ', desiredEventObjIndex)
  //   }
  // }

  // getMessages, eventtitle
  // db.query(queryString, queryValues)
  //   .then(data => {
  //     if (data.rows[0]) {
  //       for (let i = 0; i < data.rows.length; i++) {
  //         let messageObj = data.rows[i];
  //         if (messageObj.eventtitle === eventtitle) {
  //           desiredEventObj.push(messageObj)
  //         }
  //       }
  //       res.locals.allEventsInfo[desiredEventObjIndex] = desiredEventObjIndex;
  //       console.log('res.locals.allEventsInfo: ', res.locals.allEventsInfo)
  //     }
  //   })
  //   .catch(err => {
  //     return next({
  //       log: `Error occurred with queries.getAllEvents OR eventController.allEvents middleware: ${err}`,
  //       message: { err: "An error occured with SQL when retrieving all events information." },
  //     });
  //   })
};



module.exports = eventController;
