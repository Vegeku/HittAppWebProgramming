"use strict";

const addWorkoutBtn = document.querySelector('#addWorkout');

const workoutPage = document.querySelector('#workoutPage');

const workoutList = document.querySelector("#workouts");

function home() {
    addWorkoutToDashboard()

}

function addWorkoutToDashboard() {

    addWorkoutBtn.addEventListener("click", e => {
        const cloned = workoutPage.content.cloneNode(true);
        workoutList.append(cloned);
        addWorkoutBtn.disabled = true;
        const cancel = document.querySelector("#cancelWorkout");
        const workout = document.querySelector("#workout");
        cancel.addEventListener("click", e => {
            workout.remove();
            addWorkoutBtn.disabled = false;
        })
    });
}



home();