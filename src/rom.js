// prototyping socket API for ROM
// express server with Johnny-Five and socket.io

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const five = require("johnny-five");
const board = new five.Board();

// const redis = require('redis');
// const redisHost = '127.0.0.1';
// const redisPort = process.argv[3] || 6379;
// const redisAuth = '';

// const redisClient = redis.createClient({
//     port: redisPort,
//     host: redisHost
// });

// redisClient.auth(redisAuth, (err, response) => {
//     if (err)
//         throw err;
// });

let numUsers = 0;
let runningTime = 0;
let startTime = Date.now();
let isCounting = false;
var timer;

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate)
                func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callnow)
            func.apply(context, args);
    };
}

function fetchFormattedDate() {
    const rawToday = new Date();
    let dd = rawToday.getDate(),
        mm = rawToday.getMonth() + 1,
        yyyy = rawToday.getFullYear();

    if (dd < 10)
        dd = `0${dd}`;
    if (mm < 10)
        mm = `0${mm}`;

    return `${mm}/${dd}/${yyyy}`;
}

board.on("ready", () => {
    const sw = new five.Switch(2);
    const freeToPeeLed = new five.Led(13);
    const connectionLed = new five.Led(11);
    const port = process.argv[2] || 5000;

    io.on("connection", async socket => {
        // flash connection LED once upon successful connection
        connectionLed.on() && connectionLed.off();
        // fetch door status upon user connecting
        io.emit('doorstatus', !sw.isClosed);
        // initial emit to client to grab today's date and door cycles so far
        io.emit("today", fetchFormattedDate());
        // increment number of users upon user connecting
        io.emit("addUser", numUsers += 1);
        // handle users when disconnecting from backend via leaving client
        socket.once("disconnect", () => io.emit("removeUser", numUsers -= 1));
        // redisClient.set('clientID', socket.id);
        // log socket id of connecting user along with date and total num of users
        console.log(`Today's date: ${fetchFormattedDate()}`);
        console.log(`Clients Connected: ${numUsers}`);
        console.log(`Client ${socket.id} has successfully connected to the server`);
    });

    const update = () => {
        if (isCounting) {
            // should delta be declared with let
            var delta = Date.now() - startTime;
            runningTime = runningTime += delta;
            startTime = Date.now();
            io.emit("timerStream", isCounting, runningTime);
        }
    };

    const stopTimer = () => {
        isCounting = false;
        runningTime = 0;
        clearInterval(timer);
        io.emit("timerStream", isCounting, runningTime);
    };

    const startTimer = () => {
        if (isCounting === false && runningTime === 0) {
            io.emit("doorstatus", false);
            isCounting = true;
            startTime = Date.now();
            clearInterval(timer);
            timer = setInterval(update, 10);
        }
    };

    const doClosedDoorTasks = () => {
        console.log("door is closed");
        freeToPeeLed.blink(100);
        // startTimer();
        io.emit("doorstatus", false);
    };

    const doOpenDoorTasks = () => {
        console.log("door is open");
        freeToPeeLed.stop().on();
        // stopTimer();
        isCounting = false;
        io.emit("doorstatus", true);
        runningTime = 0;
    };

    sw.on("close", () => {
        debounce(startTimer(), 1500);
        debounce(doClosedDoorTasks(), 1500);
    });

    sw.on("open", () => {
        debounce(stopTimer(), 1500);
        debounce(doOpenDoorTasks(), 1500);
    });

    server.listen(port, () => {
        console.log(`ROM IoT backend up and running on port ${port}`);
    });
});
