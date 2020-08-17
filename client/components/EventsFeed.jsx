import React, { useState, useEffect } from "react";
import Event from './Event.jsx';

export default function EventsFeed(props) {
  let events = [];
<<<<<<< HEAD
=======
  console.log("Events Feed", props)
>>>>>>> 6e2d8a0c157307bd828924eefc5dcc397114e24d
  if (props.events && Object.keys(props.events).length > 0) {
    events = props.events.map( (event, index) => {
        return <Event
         {...event}
          userUpdate={props.userUpdate}
          key={`EventsFeed${index}`}
      />
    })
  }
  return (
    <div className="events">
      {events}
    </div>
  );
}