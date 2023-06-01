// const timer = {
//     pomodoro: 25,
//     shortBreak: 5,
//     longBreak: 15,
//     longBreakInterval: 4
// };

const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("break-btn");
const addBtn = document.getElementById("add-five");
const minusBtn = document.getElementById("minus-five");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
var alarmSFX = new Audio("../resources/sfx/alarm.wav");

minutes.textContent = 25;
seconds.textContent = "00";

startBtn.addEventListener("click", start);
stopBtn.addEventListener("click", breakTime);
addBtn.addEventListener("click", addTime);
minusBtn.addEventListener("click", subtractTime);

function padZero(value) {
    // if seconds are in single digits, add a leading 0
    return value.toString().padStart(2, "0");
}

function start() {
    console.log("Starting timer...");

    minutes.textContent = padZero(parseInt(minutes.textContent) -1);
    seconds.textContent = "59";

    // set interval to 1 second
    const interval = setInterval(() => {
        if (seconds.textContent > 0) {
            seconds.textContent = padZero(parseInt(seconds.textContent) - 1);
        } else if (minutes.textContent > 0) {
            minutes.textContent = padZero(parseInt(minutes.textContent) - 1);
            seconds.textContent = "59";
        } else if (minutes.textContent === "00" && seconds.textContent === "00") {
            console.log("Time for a break...");
            // play alarm sound
            // break time
        } else {
            clearInterval(interval);
        }
    }, 1000);
}

function breakTime() {
    console.log("Taking a break...");

    minutes.textContent = "04";
    seconds.textContent = "59";

    // set interval to 1 second
    const interval = setInterval(() => {
        if (seconds.textContent > 0) {
            seconds.textContent = padZero(parseInt(seconds.textContent) - 1);
        } else if (minutes.textContent > 0) {
            minutes.textContent = padZero(parseInt(minutes.textContent) - 1);
            seconds.textContent = "59";
        } else {
            clearInterval(interval);
        }
    }, 1000);
}

function addTime() {
    console.log("Added 5 minutes to timer...");
    minutes.textContent = padZero(parseInt(minutes.textContent) + 5);
}

function subtractTime() {
    console.log("Subtracted 5 minutes from timer...");
    minutes.textContent = padZero(parseInt(minutes.textContent) - 5);

    if (minutes.textContent < 0) {
        minutes.textContent = 25;
    }
}

// TODO: working break function
// TODO: add 5 minute intervals to timer