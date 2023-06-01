const timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4
};

const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("break-btn");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
minutes.textContent = "25";
seconds.textContent = "00";

startBtn.addEventListener("click", start);
stopBtn.addEventListener("click", breakTime);

function start() {
    console.log("Starting timer...");

    minutes.textContent = "24";
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

// if seconds are in single digits, add a leading 0
function padZero(value) {
    return value.toString().padStart(2, "0");
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

// TODO: working break function
// TODO: add 5 minute intervals to timer