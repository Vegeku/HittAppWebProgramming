"use strict";


const addWorkoutBtn = document.querySelector('#addWorkout');

const workoutPage = document.querySelector('#workoutPage');

const workoutList = document.querySelector("#workouts");

let listofExercises = { exercises: [] };


function showWorkouts(workouts, where) {
    for (const workout of workouts) {
        const li = document.createElement('li');

        const em = document.createElement('workout-card');
        em.textContent = workout.name;
        em.level = workout.level;
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
    const workoutsList = document.querySelector("#workouts");
    workoutList.replaceChildren();
    showWorkouts(workouts,workoutsList);
}

async function addWorkoutToServer() {
    const level = document.querySelector('#level');
    const duration = document.querySelector('#totalTime');
    console.log(duration.textContent);
    if (listofExercises.exercises != []) {
        console.log(listofExercises.exercises);
        const payload = { name: "workout", level: level.value, duration: parseInt(duration.textContent), exercises: listofExercises.exercises }

        const response = await fetch('workout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            removeWorkoutInput();
            const workoutsList = await response.json();
            console.log(workoutsList)
            const workouts = document.querySelector("#workouts");
            const updatedWorkouts = document.querySelector("#workouts");
            updatedWorkouts.replaceChildren();
            showWorkouts(workoutsList, workouts);
        }
    }
}

function addNewRest() {
    const timeInput = document.querySelector("time-setter");
    const exercises = document.querySelector("#exercises");
    const totalTime = document.querySelector("#totalTime");
    const addRest = document.querySelector("#addRest");
    const addExercise = document.querySelector("#addExercise");
    if (timeInput.time != 0) {
        const restInfo = document.querySelector('#infoRestInput');
        totalTime.textContent = parseInt(totalTime.textContent) + parseInt(timeInput.time);
        const newRest = document.createElement("section");
        const time = document.createElement("p");
        const restLabel = document.createElement("p");
        restLabel.textContent = "Rest: ";
        time.textContent = timeInput.time;
        newRest.append(restLabel, time);
        exercises.append(newRest);
        restInfo.remove();
        addExercise.disabled = false;
        addRest.disabled = false;
    }
}

function addNewExercise() {
    const exName = document.querySelector("#exercise");
    const description = document.querySelector("#description");
    const timeInput = document.querySelector("time-setter");
    const exInfo = document.querySelector("#infoInput");
    const addExercise = document.querySelector("#addExercise");
    const exercises = document.querySelector("#exercises");
    const numberOfExercises = document.querySelector("#numberOfexercises");
    const totalTime = document.querySelector("#totalTime");
    const addRest = document.querySelector("#addRest");
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
        addExercise.disabled = false;
        addRest.disabled = false;
        listofExercises.exercises.push(JSON.stringify(payload));
        console.log(listofExercises);
    }
}

function loadExerciseInputs(e) {
    const overview = document.querySelector('#overview');
    const exercisePage = document.querySelector('#chooseExercise');
    const addRest = document.querySelector("#addRest");
    const cloned = exercisePage.content.cloneNode(true);
    overview.append(cloned);
    e.target.disabled = true;
    addRest.disabled = true;
    const send = document.querySelector('#send');
    const exInfo = document.querySelector("#infoInput");
    const cancel = document.querySelector('#cancelExercise');
    cancel.addEventListener("click", () => { exInfo.remove(); e.target.disabled = false; addRest.disabled = false });
    send.addEventListener("click", addNewExercise);
}

function loadRestInput(e) {
    const restInput = document.querySelector('#setRest');
    const overview = document.querySelector('#overview');
    const addExercise = document.querySelector("#addExercise");
    const cloned = restInput.content.cloneNode(true);
    overview.append(cloned);
    const rest = document.querySelector('#infoRestInput');
    const cancel = document.querySelector('#cancelRest');
    const addRest = document.querySelector('#sendRest');
    e.target.disabled = true;
    addExercise.disabled = true;
    cancel.addEventListener("click", () => {
        rest.remove();
        e.target.disabled = false;
        addExercise.disabled = false;
    })

    addRest.addEventListener("click", addNewRest);

}

function removeWorkoutInput() {
    const workout = document.querySelector("#workout");
    workout.remove();
    listofExercises.exercises = [];
    addWorkoutBtn.disabled = false;
}

function loadWorkoutTemplate() {
    const cloned = workoutPage.content.cloneNode(true);
    workoutList.append(cloned);
    addWorkoutBtn.disabled = true;
    const addExercise = document.querySelector("#addExercise");
    const cancel = document.querySelector("#cancelWorkout");
    const workout = document.querySelector("#workout");
    const addRest = document.querySelector("#addRest");
    const saveWorkout = document.querySelector("#saveWorkout");
    cancel.addEventListener("click", removeWorkoutInput)

    addExercise.addEventListener("click", loadExerciseInputs);
    addRest.addEventListener("click", loadRestInput);
    saveWorkout.addEventListener("click", addWorkoutToServer)
}

function home() {
    loadWorkouts();
    addWorkoutToDashboard();
}

function addWorkoutToDashboard() {
    addWorkoutBtn.addEventListener("click", loadWorkoutTemplate);
}

home();