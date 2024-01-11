import { Server } from 'socket.io';
import { readFileSync, readdirSync } from 'node:fs';
import { exec } from 'node:child_process';
import mqtt from 'mqtt';
import path from 'node:path';

const DEVICES_PREFIX = '/sys/bus/w1/devices/';
const TOP_LEFT_PIN = 27;
const TOP_RIGHT_PIN = 17;
const POLL_INTERVAL = 3000;
const MQTT_SERVER = 'mqtt:10.1.1.186:1883';
const TEMP_TOPIC = 'gas_station/temp';
const TOP_LEFT_TOPIC = 'gas_station/top_left';
const TOP_RIGHT_TOPIC = 'gas_station/top_right';

function getDeviceFile() {
  // currently assumes there is a single device
  try {
    const entries = readdirSync(DEVICES_PREFIX);
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].startsWith('28-')) {
        const hwmonEntries = readdirSync(path.join(DEVICES_PREFIX, entries[i], 'hwmon'));
        for (let j = 0; j < entries.length; j++) {
          if (hwmonEntries[i].startsWith('hwmon')) {
            return path.join(DEVICES_PREFIX, entries[i], '/hwmon', hwmonEntries[j], 'temp1_input');
          };
        };
      };
    };
  } catch {};
};

function readTemp(tempSensorFile) {
  if (tempSensorFile) {
    const valueRead = readFileSync(tempSensorFile);
    return valueRead/1000;
  }
  return 0;
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

    const mqttClient = mqtt.connect(MQTT_SERVER, {});

    setInterval(() => {
      const temp = readTemp(tempSensorFile);
      readGpio(TOP_LEFT_PIN, (left) => {
        readGpio(TOP_RIGHT_PIN, (right) => {
          io.emit('message', {temp: temp, topLeft: left, topRight: right});
          mqttClient.publish(TEMP_TOPIC, temp.toString());
          mqttClient.publish(TOP_LEFT_TOPIC, left.toString());
          mqttClient.publish(TOP_RIGHT_TOPIC, right.toString());
        });
      });
    } , POLL_INTERVAL);
  };
  res.end();
};

export default SocketHandler;
