"use strict";

const addWorkoutBtn = document.querySelector('#addWorkout');

const workoutPage = document.querySelector('#workoutPage');

const workoutList = document.querySelector("#workouts");

function addNewExercise() {
    const exName = document.querySelector("#exercise");
    const description = document.querySelector("#description");
    const timeInput = document.querySelector("time-setter");
    const exInfo = document.querySelector("#infoInput");
    const addExercise = document.querySelector("#addExercise");
    const exercises = document.querySelector("#exercises");
    if ((exName.value).trim()  != "" && (description.value).trim()  != "" && timeInput.time != 0) {
        const exercise = document.createElement("section");
        const ex = document.createElement("p");
        ex.textContent = (exName.value).trim();
        const desc = document.createElement("p");
        desc.textContent = (description.value).trim();
        const time = document.createElement("p");
        time.textContent = timeInput.time;
        exercise.append(ex,desc,time);
        exercises.append(exercise);
        exInfo.remove();
        addExercise.disabled = false;
    }
}

function loadExerciseInputs(e) {
    const overview = document.querySelector('#overview');
    const exercisePage =  document.querySelector('#chooseExercise');
    const cloned = exercisePage.content.cloneNode(true);
    overview.append(cloned);
    e.target.disabled = true;
    const send = document.querySelector('#send');
    const exInfo = document.querySelector("#infoInput");
    const cancel = document.querySelector('#cancelExercise');
    cancel.addEventListener("click", () => {exInfo.remove(), e.target.disabled = false;});
    send.addEventListener("click", addNewExercise);   
}

function loadWorkoutTemplate() {
    const cloned = workoutPage.content.cloneNode(true);
    workoutList.append(cloned);
    addWorkoutBtn.disabled = true;
    const addExercise = document.querySelector("#addExercise");
    const cancel = document.querySelector("#cancelWorkout");
    const workout = document.querySelector("#workout");
    cancel.addEventListener("click", e => {
        workout.remove();
        addWorkoutBtn.disabled = false;
    })

    addExercise.addEventListener("click", loadExerciseInputs);
}

function home() {
    addWorkoutToDashboard();
}

function addWorkoutToDashboard() {
    addWorkoutBtn.addEventListener("click", loadWorkoutTemplate);
}

home();