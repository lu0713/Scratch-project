import React, { useState, useEffect } from "react";
import EventAttendees from './EventAttendees.jsx';
import Content from './Content.jsx';
import { ListGroup, Container, Row, Jumbotron } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons'

export default function Event(props) {
  console.log('Event ', props);
  return (
    <>
    <b className="hr anim"></b>
    <div className="event">
      <Container>
        <Jumbotron fluid>
          <Container className='eventJumbotron'>
<<<<<<< HEAD
            <h1>{props.title}</h1>
            <h4>{props.date} - {props.time}</h4>
            <h4>Location <FontAwesomeIcon icon={faLocationArrow} size="1x" /> : {props.location}</h4>
            <p>{props.description}</p>       
=======
            <h1>{props.eventtitle}</h1>
            <h4>{props.eventdate} - {props.starttime}</h4>
            <h4>Location <FontAwesomeIcon icon={faLocationArrow} size="1x" /> : {props.eventlocation}</h4>
            <p>{props.eventdetails}</p>       
>>>>>>> 6e2d8a0c157307bd828924eefc5dcc397114e24d
          </Container>
        </Jumbotron>

        <Container>
          <EventAttendees 
          {...props}
            userUpdate={props.userUpdate}
            />
        </Container>
        <Content {...props} />
      </Container>
    </div>
    </>
  );
}