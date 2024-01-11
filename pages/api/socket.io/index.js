import { Server } from 'socket.io';
import { readFileSync, readdirSync } from 'node:fs';
import { exec } from 'node:child_process';

const DEVICES_PREFIX = '/sys/bus/w1/devices/';
const TOP_LEFT_PIN = 17;
const TOP_RIGHT_PIN = 27;
const POLL_INTERVAL = 3000;

function getDeviceFile() {
  // currently assumes there is a single device
  const entries = readdirSync(DEVICES_PREFIX)
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].startsWith('28-')) {
      return DEVICES_PREFIX + entries[i] + '/hwmon/hwmon1/temp1_input';
    };
  };
};

function readTemp(tempSensorFile) {
  const valueRead = readFileSync(tempSensorFile);
  return valueRead/1000;
};

function readGpio(pin, callback) {
  exec('gpioget gpiochip0 ' + pin, (err, stdout, stderr) => {
    const pinValueString = stdout.replace(/\s+/g,'');

    let pinValue = false;
    if (pinValueString === '1')
      pinValue = true;

    callback(pinValue);
  });
};

const SocketHandler = (req, res) => {
  const tempSensorFile = getDeviceFile();
  if (res.socket.server.io) {
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server, { path: '/api/socket.io'});
    res.socket.server.io = io;

    setInterval(() => {
      const temp = readTemp(tempSensorFile);
      readGpio(TOP_LEFT_PIN, (left) => {
        readGpio(TOP_RIGHT_PIN, (right) => {
          io.emit('message', {temp: temp, topLeft: left, topRight: right});
        });
      });
    } , POLL_INTERVAL);
  };
  res.end();
};

export default SocketHandler;
