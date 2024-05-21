const el = {};

let listofExercises = {};
let listOfExIds;

async function loadWorkouts() {
  const response = await fetch('workouts');
  let workouts;
  if (response.ok) {
    workouts = await response.json();
    noWorkouts(workouts);
    if (workouts.length !== 0) {
      el.workoutList.replaceChildren();
      showWorkouts(workouts, el.workoutList);
    }
  } else {
    workouts = [{ exercise: 'failed to load workouts :-(' }];
  }
}

function showWorkouts(workouts, where) {
  noWorkouts(workouts);
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

function noWorkouts(listOfWorkouts) {
  if (listOfWorkouts.length === 0) {
    el.info.style.display = 'block';
  } else {
    el.info.style.display = 'none';
  }
}

function errorChecking() {
  el.error.textContent = '';
  const nameOfWorkout = el.workoutName.value.trim();
  listOfExIds = Object.keys(listofExercises);
  if (listOfExIds.length !== 0 && nameOfWorkout !== '' && listofExercises[listOfExIds[0]].name !== 'Rest' && nameOfWorkout.length <= 20) {
    el.error.style.display = 'none';
    return true;
  } else {
    el.error.style.display = 'block';
    if (listOfExIds.length === 0) {
      el.error.textContent += 'Please add exercises to the workout. ';
    }
    if (nameOfWorkout === '') {
      el.error.textContent += 'Please add a name to the workout. ';
    }
    if (listofExercises[listOfExIds[0]].name === 'Rest') {
      el.error.textContent += 'First exercise cannot be a rest. ';
    }
    if (nameOfWorkout.length > 20) {
      el.error.textContent += 'Workout name is too long. ';
    }
  }
}

async function saveWorkout() {
  if (errorChecking()) {
    const payload = {
      name: el.workoutName.value.trim(),
      difficulty: el.workoutDiff.value.trim(),
      duration: parseInt(el.totalTime.textContent),
      exercises: JSON.stringify(listofExercises),
    };
    const response = await fetch('/workout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      cancelWorkout();
      // el.info.style.display = 'none';
      listofExercises = {};
      const workoutsList = await response.json();
      el.workoutList.replaceChildren();
      showWorkouts(workoutsList, el.workoutList);
    }
  }
}


function addtoListOrEdit(e) {
  if (e.target.editable === 'create') {
    const payload = { name: e.target.textContent, desc: e.target.desc, time: e.target.time };
    listofExercises[e.target.index] = payload;
    if (e.target.textContent !== 'Rest') {
      el.nOfExercises.textContent = parseInt(el.nOfExercises.textContent) + 1;
    }
    el.totalTime.textContent = parseInt(el.totalTime.textContent) + parseInt(e.target.time);
    console.log(listofExercises);
    e.target.editable = 'false';
  } else {
    listofExercises[e.target.index] = { name: e.target.textContent, desc: e.target.desc, time: e.target.time };
    el.totalTime.textContent = parseInt(el.totalTime.textContent) - parseInt(e.detail.currentTime) + parseInt(e.target.time);
  }
}

function addRest() {
  const exercise = document.createElement('exercise-info');
  exercise.editable = 'create';
  exercise.textContent = 'Rest';
  exercise.desc = 'Rest';
  exercise.index = crypto.randomUUID();
  el.exercises.append(exercise);
  exercise.addEventListener('deleteExercise', deleteExercise);
  exercise.addEventListener('editExercise', addtoListOrEdit);
}

function addExercise() {
  const exercise = document.createElement('exercise-info');
  exercise.editable = 'create';
  exercise.index = crypto.randomUUID();
  el.exercises.append(exercise);
  exercise.addEventListener('deleteExercise', deleteExercise);
  exercise.addEventListener('editExercise', addtoListOrEdit);
}

function deleteExercise(e) {
  el.totalTime.textContent = parseInt(el.totalTime.textContent) - parseInt(e.target.time);
  delete listofExercises[e.target.index];
  if (e.target.textContent !== 'Rest') {
    el.nOfExercises.textContent = parseInt(el.nOfExercises.textContent) - 1;
  }
  e.target.remove();
}

function addWorkout() {
  el.addWorkoutPage.showModal();
}

function cancelWorkout() {
  el.addWorkoutPage.close();
  listofExercises = {};
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
  el.info = document.querySelector('#info');
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
