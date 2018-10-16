// connect socket api

import openSocket from "socket.io-client";
const socket = openSocket("http://192.168.1.6:5000/");

function connect(cb) {
  socket.on("connection", () => {
    cb();
  });

  socket.on("addUser", updatedNumber => {
    cb(updatedNumber);
  });

  socket.on("removeUser", updatedNumber => {
    cb(updatedNumber);
  });
}
function checkDoorStatus(cb) {
  socket.on("doorstatus", result => {
    console.log("door is currently open?", result);
    cb(result);
  });
}

function toggle(cb) {
  socket.on("toggle", () => {
    console.log("timer toggled");
    cb();
  });
}

export { connect, checkDoorStatus, toggle };
