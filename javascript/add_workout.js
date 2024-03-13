'use strict';

// data set id 
function dashboardAddition() {
    const addWorkout = document.querySelector("#addWorkout");

    addWorkout.addEventListener('click', workoutDataInput);
}

function workoutDataInput() {

    const workout = document.querySelector("#workouts");

    const exerciseName = document.createElement("input");
    exerciseName.placeholder = "exercise name"


    const input = document.createElement("section");
    input.classList.add("inputs");

    const durationMinutes = document.createElement("p");
    const addMinutes = document.createElement("button");
    addMinutes.textContent = "+";
    const decreaseMinutes = document.createElement("button");
    decreaseMinutes.textContent = "-";
    durationMinutes.textContent = 0;
    addMinutes.addEventListener('click', () => { durationMinutes.textContent = parseInt(durationMinutes.textContent) + 1; });
    decreaseMinutes.addEventListener('click', () => {
        if (parseInt(addMinutes.textContent) > 0) {
            addMinutes.textContent = parseInt(addMinutes.textContent) - 1;
        }
    });


    const durationSeconds = document.createElement("p");
    const addSeconds = document.createElement("button");
    addSeconds.textContent = "+";
    const decreaseSeconds = document.createElement("button");
    decreaseSeconds.textContent = "-";
    durationSeconds.textContent = 0;
    addSeconds.addEventListener('click', () => { durationSeconds.textContent = parseInt(durationSeconds.textContent) + 1; });;
    decreaseSeconds.addEventListener('click', () => {
        if (parseInt(addMinutes.textContent) > 0) {
            addMinutes.textContent = parseInt(addMinutes.textContent) - 1;
        }
    });

    


    const exerciseDescription = document.createElement("input");
    exerciseDescription.placeholder = "exercise description";

    const save = document.createElement("button");
    save.textContent = "Save";

    input.append(exerciseName, exerciseDescription,addMinutes,durationMinutes,decreaseMinutes,addSeconds,durationSeconds,decreaseSeconds, save);

    workout.append(input);

    save.addEventListener('click', () => {
        workoutCard(exerciseName.value,exerciseDescription.value, `${durationMinutes.textContent} : ${durationSeconds.textContent} `, '');
    });

}

// function increment() {

// }

// function decrement() {

// }

function workoutCard(title, description, duration, image) {
    // const workout = document.querySelector("#workouts");

    const input = document.querySelector(".inputs");

    const card = document.createElement("section");

    const name = document.createElement("p");
    const time = document.createElement("p");
    const background = document.createElement("img");
    const difficulty = document.createElement("p");

    name.textContent = title;
    time.textContent = duration;

    card.classList.add('workout');
    card.append(name, time, background, difficulty);

    input.replaceWith(card);

}


dashboardAddition();