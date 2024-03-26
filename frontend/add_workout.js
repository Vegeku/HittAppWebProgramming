"use strict";

const addWorkoutBtn = document.querySelector('#addWorkout');

const workoutPage = document.querySelector('#workoutPage');

const workoutList = document.querySelector("#workouts");

function addNewExercise(e) {
    const exercise = document.querySelector("#exercise");
    const description = document.querySelector("#description");
    const timeInput = document.querySelector("time-setter");
    const exInfo = document.querySelector("#infoInput");
    const addExercise = document.querySelector("#addExercise");
    if ((exercise.value).trim()  != "" && (description.value).trim()  != "" && timeInput.time != 0) {
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