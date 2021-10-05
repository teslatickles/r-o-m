// connect socket api
// bridges backend socket.io connections with React frontend

const openSocket = require('socket.io-client');
const socket = openSocket('xxx.xxx.x.xxx:5000');

function connect(callback) {
    socket.on("connection", () => callback());
    socket.on("addUser", updatedNumber => callback(updatedNumber));
    socket.on("removeUser", updatedNumber => callback(updatedNumber));
}

function getToday(callback) {
    socket.on("today", result => callback(result));
}

// obsolete method that will soon be removed
// function getDoorCount(callback) {
//     socket.on("pCount", result => callback(result));
// }

function checkDoorStatus(callback) {
    socket.on("doorstatus", result => callback(result));
}

function timerUpdate(callback) {
    socket.on("timerStream", (isCounting, runTime) => callback(isCounting, runTime));
}

export { connect, getToday, checkDoorStatus, timerUpdate };
