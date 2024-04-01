el = {}

function changeExercise(current, next) {
    el.exercise.textContent = current;
    el.nextExercise.textContent = next;
}


function startWorkout() {
    let interval;
    const numberOfExercises = el.exerciseList.length;
    let currentExerciseIndex = 0;
    el.timeLeft.textContent = el.totalTime;

    changeExercise(el.exerciseList[currentExerciseIndex].name, el.exerciseList[currentExerciseIndex + 1].name);

    el.duration.textContent = el.exerciseList[0].time;

}

function getData() {
    workoutExercises = JSON.parse(sessionStorage.getItem('exercises'));
    el.totalTime = sessionStorage.getItem('totalTime');
    el.exerciseList = workoutExercises.exercises;
}

function prepareHadlers() {
    el.timeLeft = document.querySelector("h2");
    el.exercise = document.querySelectorAll("p")[0];
    el.duration = document.querySelectorAll("p")[1];
    el.nextExercise = document.querySelectorAll("p")[2];
    el.stop = document.querySelectorAll("button")[0];
    el.pause = document.querySelectorAll("button")[1];
}

function initialise() {
    prepareHadlers();
    getData();
    startWorkout();
}

initialise();