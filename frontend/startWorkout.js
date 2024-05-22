const el = {};

let interval;

function selectPauseOrContinue(element) {
  if (element === 'pause') {
    const pauseSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    pauseSVG.setAttribute('width', '1em');
    pauseSVG.setAttribute('height', '1em');
    pauseSVG.setAttribute('viewBox', '0 0 24 24');
    pauseSVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    newPath.setAttribute('fill', 'currentColor');
    newPath.setAttribute('d', 'M14 19V5h4v14zm-8 0V5h4v14z');
    pauseSVG.appendChild(newPath);
    return pauseSVG;
  } else {
    const continueSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    continueSvg.setAttribute('width', '1em');
    continueSvg.setAttribute('height', '1em');
    continueSvg.setAttribute('viewBox', '0 0 32 32');
    continueSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    newPath.setAttribute('fill', 'currentColor');
    newPath.setAttribute('d', 'M10 28a1 1 0 0 1-1-1V5a1 1 0 0 1 1.501-.865l19 11a1 1 0 0 1 0 1.73l-19 11A1 1 0 0 1 10 28M4 4h2v24H4z');
    continueSvg.appendChild(newPath);
    return continueSvg;
  }
}

function changeExercise(current, next) {
  el.exercise.textContent = current;
  el.nextExercise.textContent = next;
}

function changeTimer() {
  if (parseInt(el.duration.textContent) <= 0 && el.currentIndex < el.exercisesIndex.length - 1) {
    el.currentIndex += 1;
    el.duration.textContent = el.exerciseList[el.exercisesIndex[el.currentIndex]].time;
  } else if (parseInt(el.duration.textContent) > 0) {
    el.duration.textContent = parseInt(el.duration.textContent) - 1;
    el.timeLeft.textContent = parseInt(el.timeLeft.textContent) - 1;
  }

  if (el.currentIndex + 1 < el.exercisesIndex.length) {
    changeExercise(el.exerciseList[el.exercisesIndex[el.currentIndex]].name, el.exerciseList[el.exercisesIndex[el.currentIndex + 1]].name);
  } else if (el.currentIndex + 1 === el.exercisesIndex.length) {
    changeExercise(el.exerciseList[el.exercisesIndex[el.currentIndex]].name, 'no more exercises left');
  }

  if (el.currentIndex === el.exercisesIndex.length - 1 && parseInt(el.duration.textContent) === 0) {
    el.currentIndex += 1;
    el.timeLeft.textContent = 0;
    stopAlert("Well Done! You've completed the workout!");
  }

  const main = document.querySelector('main');
  if (el.duration.textContent <= 3) {
    main.classList.add('highlight');
  } else {
    main.classList.remove('highlight');
  }
}

function startWorkout() {
  el.currentIndex = 0;
  el.timeLeft.textContent = el.totalTime;
  el.duration.textContent = el.exerciseList[el.exercisesIndex[el.currentIndex]].time;
  if (el.currentIndex + 1 < el.exercisesIndex.length) {
    changeExercise(el.exerciseList[el.exercisesIndex[el.currentIndex]].name, el.exerciseList[el.exercisesIndex[el.currentIndex + 1]].name);
  } else if (el.currentIndex + 1 === el.exercisesIndex.length) {
    changeExercise(el.exerciseList[el.exercisesIndex[el.currentIndex]].name, 'no more exercises left');
  }
  interval = setInterval(changeTimer, 1000);
}

function stopAlert(message) {
  el.stopMessage.showModal();
  const stopMessage = document.querySelector('#congratulations');
  stopMessage.textContent = message;
  setTimeout(stopWorkout, 2000);
}

function stopWorkout() {
  clearInterval(interval);
  window.location.href = 'index.html';
}

function continueAndPauseWorkout() {
  const svg = el.pauseOrContinue.querySelector('svg');
  if (el.pauseOrContinue.id === 'pause') {
    clearInterval(interval);
    el.pauseOrContinue.id = 'continue';
    el.pauseOrContinueTxt.textContent = 'continue';
    el.pauseOrContinue.replaceChild(selectPauseOrContinue('continue'), svg);
    el.pauseGif.style.display = 'inline';
    el.workoutOverview.style.display = 'none';
  } else if (el.pauseOrContinue.id === 'continue') {
    interval = setInterval(changeTimer, 1000);
    el.pauseOrContinue.id = 'pause';
    el.pauseOrContinueTxt.textContent = 'pause';
    el.pauseOrContinue.replaceChild(selectPauseOrContinue('pause'),
      svg);
    el.pauseGif.style.display = 'none';
    el.workoutOverview.style.display = 'inline';
  }
}

function getData() {
  const workoutExercises = sessionStorage.getItem('exercises');
  el.totalTime = sessionStorage.getItem('totalTime');
  el.exerciseList = JSON.parse(workoutExercises);
  el.exercisesIndex = Object.keys(el.exerciseList);
  console.log(el.exercisesIndex.length);
  console.log(el.exerciseList);
}


function addButtonFunctionality() {
  el.stop.addEventListener('click', () => { stopAlert('Better Luck Next Time!'); });
  el.pauseOrContinue.addEventListener('click', continueAndPauseWorkout);
}

function prepareHadlers() {
  el.pauseOrContinueTxt = document.querySelector('span');
  el.timeLeft = document.querySelector('h2');
  el.exercise = document.querySelector('#current');
  el.duration = document.querySelector('#duration');
  el.nextExercise = document.querySelector('#next');
  el.stop = document.querySelectorAll('button')[0];
  el.pauseOrContinue = document.querySelectorAll('button')[1];
  el.stopMessage = document.querySelector('dialog');
  el.workoutOverview = document.querySelector('#workout-view');
  el.pauseGif = document.querySelector('#pause-gif');
}

function initialise() {
  prepareHadlers();
  getData();
  addButtonFunctionality();
  startWorkout();
}

initialise();
