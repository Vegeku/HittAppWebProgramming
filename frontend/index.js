'use strict';


const el = {};

const listofExercises = { exercises: [] };

async function loadWorkouts() {
  const response = await fetch('workouts');
  let workouts;
  if (response.ok) {
    workouts = await response.json();
    if (workouts.length !== 0) {
      const info = document.querySelector('#info');
      info.style.display = 'none';
      el.workoutList.replaceChildren();
      showWorkouts(workouts, el.workoutList);
    }
  } else {
    workouts = [{ exercise: 'failed to load workouts :-(' }];
  }
}

function showWorkouts(workouts, where) {
  for (const workout of workouts) {
    const li = document.createElement('li');


    const em = document.createElement('workout-card');
    em.textContent = workout.name;
    em.duration = workout.duration;
    em.diff = workout.difficulty;
    em.url = `./workout/${workout.id}`;

    li.append(em);
    where.append(li);
  }
}

function errorChecking() {
  el.error.textContent = '';
  const nameOfWorkout = el.workoutName.value.trim();
  if (listofExercises.exercises.length !== 0 && nameOfWorkout !== '' && listofExercises.exercises[0].name !== 'Rest' && nameOfWorkout.length <= 20) {
    el.error.style.display = 'none';
    return true;
  } else {
    el.error.style.display = 'block';
    if (listofExercises.exercises.length === 0) {
      el.error.textContent += 'Please add exercises to the workout. ';
    }
    if (nameOfWorkout === '') {
      el.error.textContent += 'Please add a name to the workout. ';
    }
    if (listofExercises.exercises[0].name === 'Rest') {
      el.error.textContent += 'First exercise cannot be a rest. ';
    }
    if (nameOfWorkout.length > 20) {
      el.error.textContent += 'Workout name is too long. ';
    }
  }
}

async function saveWorkout() {
  listofExercises.exercises = listofExercises.exercises.filter((exercise) => exercise != null);
  const exercisesList = document.querySelectorAll('exercise-info');
  for (let i = 0; i < listofExercises.exercises.length; i++) {
    exercisesList[i].index = i;
  }
  if (errorChecking()) {
    const payload = {
      name: el.workoutName.value.trim(),
      difficulty: el.workoutDiff.value.trim(),
      duration: parseInt(el.totalTime.textContent),
      exercises: listofExercises.exercises,
    };
    const response = await fetch('/workout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      cancelWorkout();
      listofExercises.exercises = [];
      const workoutsList = await response.json();
      el.workoutList.replaceChildren();
      showWorkouts(workoutsList, el.workoutList);
    }
  }
}

function deleteExercise(e) {
  e.target.remove();
  el.totalTime.textContent = parseInt(el.totalTime.textContent) - parseInt(listofExercises.exercises[e.detail.index].time);
  listofExercises.exercises[e.detail.index] = null;
  el.nOfExercises.textContent = parseInt(el.nOfExercises.textContent) - 1;
}


function addtoList(e) {
  console.log('add to list');
  const payload = { name: e.target.textContent, desc: e.target.desc, time: e.target.time };
  listofExercises.exercises.push(payload);
  el.nOfExercises.textContent = parseInt(el.nOfExercises.textContent) + 1;
  el.totalTime.textContent = parseInt(el.totalTime.textContent) + parseInt(e.target.time);
  console.log(listofExercises.exercises);
}

function addRest() {
  const exercise = document.createElement('exercise-info');
  exercise.editable = 'create';
  exercise.textContent = 'Rest';
  exercise.desc = 'Rest';
  exercise.index = listofExercises.exercises.length;
  el.exercises.append(exercise);
  exercise.addEventListener('deleteExercise', deleteExercise);
  exercise.addEventListener('editExercise', addtoList);
}

function addExercise() {
  const exercise = document.createElement('exercise-info');
  exercise.editable = 'create';
  exercise.index = listofExercises.exercises.length;
  el.exercises.append(exercise);
  exercise.addEventListener('deleteExercise', deleteExercise);
  exercise.addEventListener('editExercise', addtoList);
}

function addWorkout() {
  el.addWorkoutPage.showModal();
}

function cancelWorkout() {
  el.addWorkoutPage.close();
  listofExercises.exercises = [];
  el.workoutName.value = '';
  el.nOfExercises.textContent = 0;
  el.totalTime.textContent = 0;
  el.exercises.replaceChildren();
}

function loadElements() {
  el.error = document.querySelector('#error');
  el.workoutName = document.querySelector('#workoutName');
  el.addWorkout = document.querySelector('#addWorkout');
  el.addExercise = document.querySelector('#addExercise');
  el.addRest = document.querySelector('#addRest');
  el.saveWorkout = document.querySelector('#saveWorkout');
  el.cancelWorkout = document.querySelector('#cancelWorkout');
  el.totalTime = document.querySelector('#totalTime');
  el.workouts = document.querySelector('#workouts');
  el.exercises = document.querySelector('#exercises');
  el.addWorkoutPage = document.querySelector('#workoutPage');
  el.nOfExercises = document.querySelector('#numberOfexercises');
  el.workoutDiff = document.querySelector('#level');
  el.workoutList = document.querySelector('#workouts');
}

function addListeners() {
  el.addWorkout.addEventListener('click', addWorkout);
  el.addExercise.addEventListener('click', addExercise);
  el.addRest.addEventListener('click', addRest);
  el.saveWorkout.addEventListener('click', saveWorkout);
  el.cancelWorkout.addEventListener('click', cancelWorkout);
}

function home() {
  loadElements();
  addListeners();
  loadWorkouts();
}
home();
