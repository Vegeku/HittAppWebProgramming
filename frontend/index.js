'use strict';


const el = {};

const listofExercises = { exercises: [] };

function buttonSoundEffect() {
  const audio = new Audio('/audio/click_noise.mp3');
  audio.play();
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

async function loadWorkouts() {
  const response = await fetch('workouts');
  let workouts;
  if (response.ok) {
    workouts = await response.json();
    console.log(workouts);
  } else {
    workouts = [{ exercise: 'failed to load exercises :-(' }];
  }
  el.workoutList.replaceChildren();
  showWorkouts(workouts, el.workoutList);
}

async function addWorkoutToServer() {
  el.error.textContent = '';
  const duration = document.querySelector('#totalTime');
  const workoutName = document.querySelector('#workoutName');
  const workoutDiff = document.querySelector('#level');
  if (listofExercises.exercises.length !== 0 && (workoutName.value).trim() && (workoutDiff.value).trim()) {
    el.error.textContent = '';
    const payload = { name: (workoutName.value).trim(), difficulty: (workoutDiff.value).trim(), duration: parseInt(duration.textContent), exercises: listofExercises.exercises };
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
  } else if (listofExercises.exercises.length === 0) {
    el.error.textContent = `${el.error.textContent} \n There are no exercises`;
  }
  if (!(workoutName.value).trim()) {
    el.error.textContent = `${el.error.textContent} \n You haven't given a name to your workout`;
  }
}

function addNewRest() {
  const timeInput = document.querySelector('time-setter');
  const exercises = document.querySelector('#exercises');
  const totalTime = document.querySelector('#totalTime');
  el.error.textContent = '';
  if (timeInput.time !== 0) {
    el.error.textContent = '';
    totalTime.textContent = parseInt(totalTime.textContent) + parseInt(timeInput.time);
    const newRest = document.createElement('section');
    const time = document.createElement('p');
    const restLabel = document.createElement('p');
    restLabel.textContent = 'Rest: ';
    time.textContent = timeInput.time;
    const payload = { name: 'Rest', desc: 'relax', time: timeInput.time };
    listofExercises.exercises.push(JSON.stringify(payload));
    newRest.append(restLabel, time);
    exercises.append(newRest);
    el.rest.remove();
    el.addExercise.disabled = false;
    el.addRest.disabled = false;
  } else {
    el.error.textContent = 'The rest cannot be 0';
  }
}

function addNewExercise() {
  const exName = document.querySelector('#exercise');
  const description = document.querySelector('#description');
  const timeInput = document.querySelector('time-setter');
  const exInfo = document.querySelector('#infoInput');
  const exercises = document.querySelector('#exercises');
  const numberOfExercises = document.querySelector('#numberOfexercises');
  const totalTime = document.querySelector('#totalTime');
  el.error.textContent = '';
  if ((exName.value).trim() !== '' && (description.value).trim() !== '' && timeInput.time !== 0) {
    el.error.textContent = '';
    const payload = { name: (exName.value).trim(), desc: (description.value).trim(), time: timeInput.time };
    numberOfExercises.textContent = parseInt(numberOfExercises.textContent) + 1;
    totalTime.textContent = parseInt(totalTime.textContent) + parseInt(timeInput.time);
    const exercise = document.createElement('section');
    const ex = document.createElement('p');
    ex.textContent = (exName.value).trim();
    const desc = document.createElement('p');
    desc.textContent = (description.value).trim();
    const time = document.createElement('p');
    time.textContent = timeInput.time;
    exercise.append(ex, desc, time);
    exercises.append(exercise);
    exInfo.remove();
    el.addExercise.disabled = false;
    el.addRest.disabled = false;
    listofExercises.exercises.push(JSON.stringify(payload));
  }
  if (!(exName.value).trim()) {
    el.error.textContent = `${el.error.textContent} \n You haven't given the name of the exercise.`;
  }
  if (!(description.value).trim()) {
    el.error.textContent = `${el.error.textContent} \n You haven't given the description of the exercise.`;
  }
  if (timeInput.time === 0) {
    el.error.textContent = `${el.error.textContent} \n You haven't given the time of the exercise.`;
  }
  console.log(listofExercises.exercises);
}

function loadExerciseInputs(e) {
  el.overview = document.querySelector('#overview');
  const exercisePage = document.querySelector('#chooseExercise');
  const cloned = exercisePage.content.cloneNode(true);
  el.overview.append(cloned);
  e.target.disabled = true;
  el.addRest.disabled = true;
  const send = document.querySelector('#send');
  el.exInfo = document.querySelector('#infoInput');
  const cancel = document.querySelector('#cancelExercise');
  cancel.addEventListener('click', () => { el.exInfo.remove(); e.target.disabled = false; el.addRest.disabled = false; });
  cancel.addEventListener('click', buttonSoundEffect);
  send.addEventListener('click', addNewExercise);
  send.addEventListener('click', buttonSoundEffect);
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
  cancel.addEventListener('click', () => {
    el.rest.remove();
    e.target.disabled = false;
    el.addExercise.disabled = false;
  });
  cancel.addEventListener('click', buttonSoundEffect);
  addRest.addEventListener('click', addNewRest);
  addRest.addEventListener('click', buttonSoundEffect);
}

function removeWorkoutInput() {
  const workout = document.querySelector('#workout');
  workout.remove();
  listofExercises.exercises = [];
  el.addWorkoutBtn.disabled = false;
}

function loadWorkoutTemplate() {
  const cloned = el.workoutPage.content.cloneNode(true);
  el.workoutList.append(cloned);
  el.addWorkoutBtn.disabled = true;
  el.addExercise = document.querySelector('#addExercise');
  const cancel = document.querySelector('#cancelWorkout');
  el.addRest = document.querySelector('#addRest');
  const saveWorkout = document.querySelector('#saveWorkout');

  cancel.addEventListener('click', removeWorkoutInput);
  cancel.addEventListener('click', buttonSoundEffect);
  el.addExercise.addEventListener('click', loadExerciseInputs);
  el.addExercise.addEventListener('click', buttonSoundEffect);
  el.addRest.addEventListener('click', loadRestInput);
  el.addRest.addEventListener('click', buttonSoundEffect);
  saveWorkout.addEventListener('click', addWorkoutToServer);
  saveWorkout.addEventListener('click', buttonSoundEffect);
}

function prepareHadlers() {
  el.addWorkoutBtn = document.querySelector('#addWorkout');
  el.workoutPage = document.querySelector('#workoutPage');
  el.workoutList = document.querySelector('#workouts');
  el.error = document.querySelector('footer');
}

function home() {
  prepareHadlers();
  loadWorkouts();
  addWorkoutToDashboard();
}

function addWorkoutToDashboard() {
  el.addWorkoutBtn.addEventListener('click', loadWorkoutTemplate);
  el.addWorkoutBtn.addEventListener('click', buttonSoundEffect);
}

home();
