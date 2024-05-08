'use strict';

const el = {};

const listofExercises = { exercises: [] };

function updateWorkout(action,time) {

}

function addtoList(e) {
  console.log(e.target.textContent, e.target.desc, e.target.time);
  const payload = { name: e.target.textContent, desc: e.target.desc, time: e.target.time };
  listofExercises.exercises.push(JSON.stringify(payload));
  console.log(listofExercises);
}

function addRest() {
  const exercise = document.createElement('exercise-info');
  exercise.editable = 'true';
  exercise.textContent = 'Rest';
  exercise.desc = 'Rest';
  ///add index
  el.exercises.append(exercise)
  exercise.addEventListener('addExercise', addtoList);
}

function addExercise() {
  const exercise = document.createElement('exercise-info');
  exercise.editable = 'true';
  el.exercises.append(exercise)
  exercise.addEventListener('addExercise', addtoList);
}

function loadElements() {
  el.addExercise = document.querySelector('#addExercise');
  el.addRest = document.querySelector('#addRest');
  el.saveWorkout = document.querySelector('#saveWorkout');
  el.cancelWorkout = document.querySelector('#cancelWorkout');
  el.totalTime = document.querySelector('#totalTime');
  el.workouts = document.querySelector('#workouts'); 
  el.exercises = document.querySelector('#exercises');
}

function addListeners() {
  el.addExercise.addEventListener('click', addExercise);
  el.addRest.addEventListener('click', addRest);
  el.saveWorkout.addEventListener('click', saveWorkout);
  el.cancelWorkout.addEventListener('click', cancelWorkout);
}

function home() {
  loadElements();
  addListeners();
}
home();