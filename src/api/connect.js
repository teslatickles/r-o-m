// connect socket api

import openSocket from "socket.io-client";
const socket = openSocket("http://192.168.1.6:5000/");

function connect(cb) {
  socket.on("connection", () => {
    cb();
  });

  socket.emit("authentication", {
    token: prompt("have to go?") === "yes" ? "secret token" : null
  });

  socket.on("unauthorized", reason => {
    console.log(`Unauthorized:, ${reason}`);

    //   error = reason.message;

    socket.disconnect();
  });

  //   socket.on("disconnect", reason => {
  //       console.log(`Disconnected: ${error || reason}`);
  //   })

  socket.on("addUser", updatedNumber => {
    cb(updatedNumber);
  });

  socket.on("removeUser", updatedNumber => {
    cb(updatedNumber);
  });
}

function getToday(cb) {
  socket.on("today", result => {
    cb(result);
  });
}

function getDoorCount(cb) {
  socket.on("pCount", result => {
    cb(result);
  });
}

function checkDoorStatus(cb) {
  socket.on("doorstatus", result => {
    console.log("door is currently open?", result);
    cb(result);
  });
}

function logTime(cb) {
  socket.on("logTime", result => {
    cb(result);
  });
}

function timerUpdate(cb) {
  socket.on("timerStream", (isCounting, runTime) => {
    cb(isCounting, runTime);
  });
}

// function stopTimer(cb) {
//   socket.on("stopTimer", (isCounting, runningTime) => {
//     cb(isCounting, runningTime);
//   });
// }

// function toggle(cb) {
//   socket.on("toggle", () => {
//     console.log("timer toggled");
//     cb();
//   });
// }

export {
  connect,
  getToday,
  getDoorCount,
  checkDoorStatus,
  timerUpdate,
  logTime
};
