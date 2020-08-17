import React, { useState, useEffect } from "react";
import { Card} from 'react-bootstrap';

export default function Profile(props) {
  return (
    <div className="profile">
      {/* <h4>Profile</h4> */}
      {/* <Card style={{ width: '18rem' }}> */}
<<<<<<< HEAD
        <img src={props.profilePicture} />

        <Card.Body>
          <Card.Title>{props.userName}</Card.Title>
          <Card.Text>
            Hi, my name is {props.firstName} {props.lastName}!
=======
        <img src={props.profilephoto} />

        <Card.Body>
          <Card.Title>{props.username}</Card.Title>
          <Card.Text>
            Hi, my name is {props.firstname} {props.lastname}!
>>>>>>> 6e2d8a0c157307bd828924eefc5dcc397114e24d
          </Card.Text>
        </Card.Body>
      {/* </Card> */}
    </div>
  );
}