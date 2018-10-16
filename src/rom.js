// prototyping socket API for ROM
// express server with Johnny-Five

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
// const socketAuth = require("socketio-auth");

const five = require("johnny-five");
const board = new five.Board();

let numUsers = 0;

board.on("ready", () => {
  const sw = new five.Switch(2);
  const freeToPeeLed = new five.Led(13);
  const connectionLed = new five.Led(11);

  io.on("connection", async socket => {
    console.log(
      `Client-Socket ${socket.id} has successfully connected to the server`
    );
    numUsers = numUsers + 1;
    io.emit("addUser", numUsers);
    console.log({ connected: numUsers });
    connectionLed.on() && connectionLed.off();
    socket.once("disconnect", () => {
      numUsers = numUsers - 1;
      io.emit("removeUser", numUsers);
    });
    if (!sw.isClosed) {
      io.emit("doorstatus", true);
    } else {
      io.emit("doorstatus", false);
    }
  });

  //   io.on("disconnect", () => {
  //     console.log(
  //       `Client with an id of ${io.id} has disconnected from the server!`
  //     );
  //     numUsers = -1 + numUsers;
  //     io.emit("removeUser", numUsers);
  //     connectionLed.on() && connectionLed.off();
  //   });

  sw.on("close", () => {
    console.log("door is closed");
    freeToPeeLed.off();
    io.emit("toggle");
    io.emit("doorstatus", false);
  });

  sw.on("open", () => {
    console.log("door is open");
    freeToPeeLed.on();
    io.emit("toggle");
    io.emit("doorstatus", true);
  });

  server.listen(5000, () => {
    console.log("Backend server is up and running on localhost");
  });
});
