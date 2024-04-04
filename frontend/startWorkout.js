el = {}

let interval;

function changeExercise(current, next) {
    el.exercise.textContent = current;
    el.nextExercise.textContent = next;
}

function changeTimer() {
    if (parseInt(el.duration.textContent) <= 0 && el.currentIndex < el.exerciseList.length - 1) {
        el.currentIndex += 1;
        el.duration.textContent = el.exerciseList[el.currentIndex].time;
        el.timeLeft.textContent = parseInt(el.timeLeft.textContent) - parseInt(el.exerciseList[el.currentIndex - 1].time);
    } else if (parseInt(el.duration.textContent) > 0) {
        el.duration.textContent = parseInt(el.duration.textContent) - 1;
    }

    if (el.currentIndex + 1 < el.exerciseList.length) {
        changeExercise(el.exerciseList[el.currentIndex].name, el.exerciseList[el.currentIndex + 1].name);
    } else if (el.currentIndex + 1 == el.exerciseList.length) {
        changeExercise(el.exerciseList[el.currentIndex].name, "no more exercises left");
    }

    if (el.currentIndex == el.exerciseList.length - 1 && el.duration.textContent == 0) {
        el.currentIndex += 1;
        el.timeLeft.textContent = 0;
        stopWorkout();
    }
    console.log("timer is working");
}

function startWorkout() {
    el.currentIndex = 0;
    el.timeLeft.textContent = el.totalTime;
    el.duration.textContent = el.exerciseList[el.currentIndex].time;
    if (el.currentIndex + 1 < el.exerciseList.length) {
        changeExercise(el.exerciseList[el.currentIndex].name, el.exerciseList[el.currentIndex + 1].name);
    } else if (el.currentIndex + 1 == el.exerciseList.length) {
        changeExercise(el.exerciseList[el.currentIndex].name, "no more exercises left");
    }
    interval = setInterval(changeTimer, 1000);
}

function stopWorkout() {
    clearInterval(interval);
    window.location.href = "index.html";
}

function continueAndPauseWorkout() {
    if (el.pauseOrContinue.textContent == "pause") {
        clearInterval(interval);
        el.pauseOrContinue.textContent = "continue";
    } else if (el.pauseOrContinue.textContent == "continue") {
        interval = setInterval(changeTimer, 1000);
        el.pauseOrContinue.textContent = "pause"
    }
}

function getData() {
    workoutExercises = JSON.parse(sessionStorage.getItem('exercises'));
    el.totalTime = sessionStorage.getItem('totalTime');
    el.exerciseList = workoutExercises.exercises;
}

function addButtonFunctionality() {
    el.stop.addEventListener("click", stopWorkout);
    el.pauseOrContinue.addEventListener("click", continueAndPauseWorkout);
}

function prepareHadlers() {
    el.timeLeft = document.querySelector("h2");
    el.exercise = document.querySelectorAll("p")[0];
    el.duration = document.querySelectorAll("p")[1];
    el.nextExercise = document.querySelectorAll("p")[2];
    el.stop = document.querySelectorAll("button")[0];
    el.pauseOrContinue = document.querySelectorAll("button")[1];
}

function initialise() {
    prepareHadlers();
    getData();
    addButtonFunctionality();
    startWorkout();
}

initialise();