'use client'
import React from "react";
import Thermometer from './Thermometer';
import GasTank from './GasTank';
import { useState } from 'react';
import io from 'socket.io-client'

let defaultSet = false;
let Socket

export default function Home() {
  const [currentTemp, setTemp] = useState(10);
  const [topLeft, setLeft] = useState(false);
  const [topRight, setRight] = useState(false);

  React.useEffect(() => {
    // Create a socket connection
    const socket = io({ path: '/api/socket.io'});

    // Listen for incoming messages
    socket.on('message', (message) => {
      if (message.temp)
        setTemp(message.temp);

      if (message.topLeft !== undefined)
        setLeft(message.topLeft);

      if (message.topRight !== undefined)
        setRight(message.topRight);
    });

    // Clean up the socket connection on unmount
    return () => {
        socket.disconnect();
    };
  }, []);

  return (
    <div >
      <div style={{ paddingLeft: '10px', paddingTop: '10px', height:'250px', width:'100%'}}>
        <table style={{ border: '3px solid black' }}>
          <tbody>
            <tr><td colSpan='2' style={{textAlign: 'center'}}>Gas Station Dashboard</td></tr>
            <tr><td><Thermometer data={currentTemp}/></td>
                <td><GasTank data={{Left: topLeft, Right: topRight}}/></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
