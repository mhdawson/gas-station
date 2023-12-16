
'use client'
import React from "react";
import Thermometer from './Thermometer';
import { useState } from 'react';
import io from 'socket.io-client'

let defaultSet = false;
let Socket


export default function Home() {
  const [currentTemp, setTemp] = useState(0);

  if (defaultSet === false) {
    defaultSet = true;
    setTemp(15);
  }

  React.useEffect(() => {
    // Create a socket connection
    const socket = io({ path: '/api/socket.io'});

    // Listen for incoming messages
    socket.on('message', (message) => {
      if (message.temp)
        setTemp(message.temp)
    });

    // Clean up the socket connection on unmount
    return () => {
        socket.disconnect();
    };
  }, []);

  return (
    <div style={{paddingLeft:'50px'}}>
      <h2>Temperature</h2>
      <div style={{paddingLeft:'50px', height:'500px', width:'100%'}}>
        <Thermometer data={currentTemp} />
      </div>
    </div>
  )
}
