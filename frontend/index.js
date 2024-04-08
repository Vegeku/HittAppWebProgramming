"use strict";


let el = {};

let listofExercises = { exercises: [] };


function showWorkouts(workouts, where) {
    for (const workout of workouts) {
        const li = document.createElement('li');

        const em = document.createElement('workout-card');
        em.textContent = workout.name;
        em.duration = workout.duration;
        em.url = `./workout/${workout.id}`;

        li.append(em);
        where.append(li);

    }
}

async function loadWorkouts() {
    const response = await fetch('workouts');
    let workouts;
    if (response.ok) {
        workouts = await response.json();
    } else {
        workouts = [{ exercise: 'failed to load exercises :-(' }];
    }
    el.workoutList.replaceChildren();
    showWorkouts(workouts,el.workoutList);
}

async function addWorkoutToServer() {
    const duration = document.querySelector('#totalTime');
    const workoutName = document.querySelector('#workoutName');
    const workoutDesc = document.querySelector('#workoutDesc');
    if (listofExercises.exercises.length != 0 && (workoutName.value).trim() && (workoutDesc.value).trim() ) {
        const payload = { name: (workoutName.value).trim(),description: (workoutDesc.value).trim() , duration: parseInt(duration.textContent), exercises: listofExercises.exercises };

        const response = await fetch('workout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            removeWorkoutInput();
            const workoutsList = await response.json();
            el.workoutList.replaceChildren();
            showWorkouts(workoutsList, el.workoutList);
        }
    }
}

function addNewRest() {
    const timeInput = document.querySelector("time-setter");
    const exercises = document.querySelector("#exercises");
    const totalTime = document.querySelector("#totalTime");
    if (timeInput.time != 0 && listofExercises.exercises.length != 0) {
        if (JSON.parse(listofExercises.exercises[listofExercises.exercises.length - 1]).name != "Rest") {
            console.log(JSON.parse(listofExercises.exercises[listofExercises.exercises.length - 1]).name);
            totalTime.textContent = parseInt(totalTime.textContent) + parseInt(timeInput.time);
            const newRest = document.createElement("section");
            const time = document.createElement("p");
            const restLabel = document.createElement("p");
            restLabel.textContent = "Rest: ";
            time.textContent = timeInput.time;
            const payload = {name: "Rest", desc: "relax", time: timeInput.time};
            listofExercises.exercises.push(JSON.stringify(payload));
            newRest.append(restLabel, time);
            exercises.append(newRest);
            el.rest.remove();
            el.addExercise.disabled = false;
            el.addRest.disabled = false;
        }
    }
}

function addNewExercise() {
    const exName = document.querySelector("#exercise");
    const description = document.querySelector("#description");
    const timeInput = document.querySelector("time-setter");
    const exInfo = document.querySelector("#infoInput");
    const exercises = document.querySelector("#exercises");
    const numberOfExercises = document.querySelector("#numberOfexercises");
    const totalTime = document.querySelector("#totalTime");
    if ((exName.value).trim() != "" && (description.value).trim() != "" && timeInput.time != 0) {
        const payload = { name: (exName.value).trim(), desc: (description.value).trim(), time: timeInput.time };
        numberOfExercises.textContent = parseInt(numberOfExercises.textContent) + 1;
        totalTime.textContent = parseInt(totalTime.textContent) + parseInt(timeInput.time);
        const exercise = document.createElement("section");
        const ex = document.createElement("p");
        ex.textContent = (exName.value).trim();
        const desc = document.createElement("p");
        desc.textContent = (description.value).trim();
        const time = document.createElement("p");
        time.textContent = timeInput.time;
        exercise.append(ex, desc, time);
        exercises.append(exercise);
        exInfo.remove();
        el.addExercise.disabled = false;
        el.addRest.disabled = false;
        listofExercises.exercises.push(JSON.stringify(payload));
    }
}

function loadExerciseInputs(e) {
    el.overview = document.querySelector('#overview');
    const exercisePage = document.querySelector('#chooseExercise');
    const cloned = exercisePage.content.cloneNode(true);
    el.overview.append(cloned);
    e.target.disabled = true;
    addRest.disabled = true;
    const send = document.querySelector('#send');
    el.exInfo = document.querySelector("#infoInput");
    const cancel = document.querySelector('#cancelExercise');
    cancel.addEventListener("click", () => { el.exInfo.remove(); e.target.disabled = false; el.addRest.disabled = false });
    send.addEventListener("click", addNewExercise);
}

function loadRestInput(e) {
    const restInput = document.querySelector('#setRest');
    const cloned = restInput.content.cloneNode(true);
    el.overview.append(cloned);
    el.rest = document.querySelector('#infoRestInput');
    const cancel = document.querySelector('#cancelRest');
    const addRest = document.querySelector('#sendRest');
    e.target.disabled = true;
    el.addExercise.disabled = true;
    cancel.addEventListener("click", () => {
        el.rest.remove();
        e.target.disabled = false;
        el.addExercise.disabled = false;
    })

    addRest.addEventListener("click", addNewRest);

}

function removeWorkoutInput() {
    const workout = document.querySelector("#workout");
    workout.remove();
    listofExercises.exercises = [];
    el.addWorkoutBtn.disabled = false;
}

function loadWorkoutTemplate() {
    const cloned = workoutPage.content.cloneNode(true);
    el.workoutList.append(cloned);
    el.addWorkoutBtn.disabled = true;
    el.addExercise = document.querySelector("#addExercise");
    const cancel = document.querySelector("#cancelWorkout");
    el.addRest = document.querySelector("#addRest");
    const saveWorkout = document.querySelector("#saveWorkout");

    cancel.addEventListener("click", removeWorkoutInput)
    el.addExercise.addEventListener("click", loadExerciseInputs);
    el.addRest.addEventListener("click", loadRestInput);
    saveWorkout.addEventListener("click", addWorkoutToServer)
}

function prepareHadlers() {
    el.addWorkoutBtn = document.querySelector('#addWorkout');
    el.workoutPage = document.querySelector('#workoutPage');
    el.workoutList = document.querySelector("#workouts");
}

function home() {
    prepareHadlers();
    loadWorkouts();
    addWorkoutToDashboard();
}

function addWorkoutToDashboard() {
    el.addWorkoutBtn.addEventListener("click", loadWorkoutTemplate);
}

home();