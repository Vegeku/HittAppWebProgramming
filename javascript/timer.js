// const timer = document.querySelector('#time');
const seconds = document.querySelector('#seconds');
const stopButton = document.querySelector('#stop');
const startButton = document.querySelector('#start');
const pauseButton = document.querySelector('#pause');

const addButtons = document.querySelectorAll('.increase');
const minusButtons = document.querySelectorAll('.decrease');


// const interval = setInterval(() => {
//     timer.textContent = parseInt(timer.textContent) + 1;
// }, 1000);

// stopButton.addEventListener('click', () => {
//     timer.textContent = 0;
//     clearInterval(interval);
// });

// stopButton.addEventListener('click', () => {
//     timer.textContent = 0;
//     clearInterval(interval);
// });

let interval;

// function startTimer() {

// }

// function stopTimer() {

// }
 
// function pauseTimer() {

// }

startButton.addEventListener('click', () => {
    interval = setInterval(() => {
        if (parseInt(seconds.textContent) != 0) {
            seconds.textContent = parseInt(seconds.textContent) - 1;
        }
    }, 1000);
});

stopButton.addEventListener('click', () => {
    seconds.textContent = 30;
    clearInterval(interval);
    interval = null;
});

pauseButton.addEventListener('click', () => {
    clearInterval(interval);
    interval = null;
});