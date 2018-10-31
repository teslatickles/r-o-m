// prototyping socket API for ROM
// express server with Johnny-Five

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const socketAuth = require("socketio-auth");
const adapter = require("socket.io-redis");

// const redisAdapter = adapter({
//   host: process.env.REDIS_HOST || "localhost",
//   port: process.env.REDIS_PORT || 3000,
//   password: process.env.REDIS_PASS || "password"
// });

// io.adapter(redisAdapter);

const five = require("johnny-five");
const board = new five.Board();

let numUsers = 0;
let startTime = Date.now();
var runningTime = 0;
var timer;
let isCounting = false;
let pCount = 0;

board.on("ready", () => {
  const sw = new five.Switch(2);
  const freeToPeeLed = new five.Led(13);
  const connectionLed = new five.Led(11);

  io.on("connection", async socket => {
    // if-else necessary to have state fetched before rendering client-side
    // also MUST be included here, in async connection socket event
    // - blog this!!!!!! my surmounting of problem!!!!!
    if (!sw.isClosed) {
      io.emit("doorstatus", true);
    } else {
      io.emit("doorstatus", false);
    }
    const rawToday = new Date();
    let dd = rawToday.getDate();
    let mm = rawToday.getMonth() + 1;
    let yyyy = rawToday.getFullYear();

    if (dd < 10) {
      dd = `0${dd}`;
    }

    if (mm < 10) {
      mm = `0${mm}`;
    }
    const today = `${mm}/${dd}/${yyyy}`;
    io.emit("today", today);
    io.emit("pCount", pCount);
    numUsers = numUsers + 1;
    io.emit("addUser", numUsers);
    connectionLed.on() && connectionLed.off();
    socket.once("disconnect", () => {
      numUsers = numUsers - 1;
      io.emit("removeUser", numUsers);
    });
    console.log(`Clients Connected: ${numUsers}`);
    console.log(`Client ${socket.id} has successfully connected to the server`);
    console.log(`Today's date: ${today}`);
  });

  const update = () => {
    if (isCounting) {
      var delta = Date.now() - startTime;
      runningTime = runningTime += delta;
      startTime = Date.now();
      io.emit("timerStream", isCounting, runningTime);
      console.log(runningTime);
      console.log(`test`);
    }
  };

  const stopTimer = () => {
    isCounting = false;
    runningTime = 0;
    clearInterval(timer);
    // pCount++ was moved here to fix table average data and count problem;
    // needed to update times and do averaging math AFTER bathroom session.
    pCount++;
    io.emit("pCount", pCount);
    io.emit("timerStream", isCounting, runningTime);
    // debug log for timer -- no runaways!
    console.log(`stopTimer has been called: ${runningTime}`);
  };

  const startTimer = () => {
    // if (!sw.isClosed) {
    //   io.emit("doorstatus", true);
    //   runningTime = 0;
    // } else {}
    // moved pCount++ to stopTimer() above
    io.emit("doorstatus", false);
    isCounting = true;
    startTime = Date.now();
    timer = setInterval(update, 10);
    // for debugging purposes
    // console.log(runningTime);
  };

  sw.on("close", () => {
    console.log("door is closed");
    freeToPeeLed.off();
    startTimer();
    io.emit("doorstatus", false);
  });

  sw.on("open", () => {
    console.log("door is open");
    freeToPeeLed.on();
    stopTimer();
    isCounting = false;
    io.emit("doorstatus", true);
    runningTime = 0;
  });

  //   async function verifyUser(token) {
  //     return new Promise((resolve, reject) => {
  //       setTimeout(() => {
  //         const users = [
  //           {
  //             id: 1,
  //             name: `always the same?`,
  //             token: `secret token`
  //           }
  //         ];
  //         const user = users.find(user => user.token === token);

  //         if (!user) {
  //           return reject(`NO USER PRESENT OR ERROR HAS OCCURRED`);
  //         }

  //         return resolve(user);
  //       }, 200);
  //     });
  //   }

  //   socketAuth(io, {
  //     authenticate: async (socket, data, callback) => {
  //       const { token } = data;

  //       try {
  //         const user = await verifyUser(token);

  //         socket.user = user;

  //         return callback(null, true);
  //       } catch (e) {
  //         console.log(`Socket ${socket.id} unauthorized.`);
  //         return callback({ message: "UNAUTHORIZED" });
  //       }
  //     },
  //     postAuthenticate: socket => {
  //       console.log(`Socket ${socket.id} authenticated.`);
  //     },
  //     disconnect: socket => {
  //       console.log(`Socket ${socket.id} disconnected.`);
  //     }
  //   });

  server.listen(5000, () => {
    console.log("Backend server is up and running on localhost");
  });
});
