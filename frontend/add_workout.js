"use strict";

const addWorkoutBtn = document.querySelector('#addWorkout');

const workoutPage = document.querySelector('#workoutPage');

const workoutList = document.querySelector("#workouts");

addWorkoutBtn.addEventListener("click", e => {
    const cloned = workoutPage.content.cloneNode(true);
    workoutList.append(cloned);
});