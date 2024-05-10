const el = {};

let interval;

function selectPauseOrContinue(element) {
  if (element === 'pause') {
    const pauseSVG = el.pauseOrContinue.querySelector('svg');
    const pauseSVGClone = pauseSVG.cloneNode(true);
    return pauseSVGClone;
  } else {
    const continueSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    continueSvg.setAttribute('width', '1em');
    continueSvg.setAttribute('height', '1em');
    continueSvg.setAttribute('viewBox', '0 0 24 24');
    continueSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    newPath.setAttribute('fill', 'currentColor');
    newPath.setAttribute('d', 'M6 6h12v12H6z');
    continueSvg.appendChild(newPath);
  }
}

function changeExercise(current, next) {
  el.exercise.textContent = current;
  el.nextExercise.textContent = next;
}

function changeTimer() {
  if (parseInt(el.duration.textContent) <= 0 && el.currentIndex < el.exerciseList.length - 1) {
    el.currentIndex += 1;
    el.duration.textContent = el.exerciseList[el.currentIndex].time;
  } else if (parseInt(el.duration.textContent) > 0) {
    el.duration.textContent = parseInt(el.duration.textContent) - 1;
    el.timeLeft.textContent = parseInt(el.timeLeft.textContent) - 1;
  }

  if (el.currentIndex + 1 < el.exerciseList.length) {
    changeExercise(el.exerciseList[el.currentIndex].name, el.exerciseList[el.currentIndex + 1].name);
  } else if (el.currentIndex + 1 == el.exerciseList.length) {
    changeExercise(el.exerciseList[el.currentIndex].name, 'no more exercises left');
  }

  if (el.currentIndex == el.exerciseList.length - 1 && el.duration.textContent == 0) {
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
  el.duration.textContent = el.exerciseList[el.currentIndex].time;
  if (el.currentIndex + 1 < el.exerciseList.length) {
    changeExercise(el.exerciseList[el.currentIndex].name, el.exerciseList[el.currentIndex + 1].name);
  } else if (el.currentIndex + 1 === el.exerciseList.length) {
    changeExercise(el.exerciseList[el.currentIndex].name, 'no more exercises left');
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
  if (el.pauseOrContinue.id === 'pause') {
    clearInterval(interval);
    el.pauseOrContinue.id = 'continue';
    el.pauseOrContinue.replaceChild(selectPauseOrContinue('continue'), el.pauseOrContinue.firstChild);
  } else if (el.pauseOrContinue.id === 'continue') {
    interval = setInterval(changeTimer, 1000);
    el.pauseOrContinue.id = 'pause';
    el.pauseOrContinue.replaceChild(selectPauseOrContinue('pause'),
      el.pauseOrContinue.firstChild);
  }
}

function getData() {
  const workoutExercises = sessionStorage.getItem('exercises');
  el.totalTime = sessionStorage.getItem('totalTime');
  el.exerciseList = JSON.parse(workoutExercises);
  console.log(el.exerciseList);
}


function addButtonFunctionality() {
  el.stop.addEventListener('click', () => { stopAlert('Better Luck Next Time!'); });
  el.pauseOrContinue.addEventListener('click', continueAndPauseWorkout);
}

function prepareHadlers() {
  el.timeLeft = document.querySelector('h2');
  el.exercise = document.querySelector('#current');
  el.duration = document.querySelector('#duration');
  el.nextExercise = document.querySelector('#next');
  el.stop = document.querySelectorAll('button')[0];
  el.pauseOrContinue = document.querySelectorAll('button')[1];
  el.stopMessage = document.querySelector('dialog');
}

function initialise() {
  prepareHadlers();
  getData();
  addButtonFunctionality();
  startWorkout();
}

initialise();
