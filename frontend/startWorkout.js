const el = {};

let interval;

function soundEffect(type) {
  let audio;
  if (type === 'button') {
    audio = new Audio('../audio/click_noise.mp3');
  } else if (type === 'beep') {
    audio = new Audio('../audio/short-beep-countdown.mp3');
  }
  audio.play();
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
    stopWorkout();
  }

  if (el.duration.textContent == 3) {
    const main = document.querySelector('main');
    soundEffect('beep');
    main.classList.add('highlight');
    setTimeout(() => {
      main.classList.remove('highlight');
    }, 3000);
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

function stopWorkout() {
  clearInterval(interval);
  window.location.href = 'index.html';
}

function continueAndPauseWorkout() {
  if (el.pauseOrContinue.id === 'pause') {
    clearInterval(interval);
    el.pauseOrContinue.id = 'continue';
  } else if (el.pauseOrContinue.id === 'continue') {
    interval = setInterval(changeTimer, 1000);
    el.pauseOrContinue.id = 'pause';
  }
}

function getData() {
  const workoutExercises = JSON.parse(sessionStorage.getItem('exercises'));
  el.totalTime = sessionStorage.getItem('totalTime');
  el.exerciseList = workoutExercises.exercises;
}

function addButtonFunctionality() {
  el.stop.addEventListener('click', stopWorkout);
  el.pauseOrContinue.addEventListener('click', continueAndPauseWorkout);
  el.stop.addEventListener('click', () => { soundEffect('button'); });
  el.pauseOrContinue.addEventListener('click', () => { soundEffect('button'); });
}

function prepareHadlers() {
  el.timeLeft = document.querySelector('h2');
  el.exercise = document.querySelectorAll('p')[1];
  el.duration = document.querySelectorAll('p')[2];
  el.nextExercise = document.querySelectorAll('p')[4];
  console.log(document.querySelectorAll('p'));
  el.stop = document.querySelectorAll('button')[0];
  el.pauseOrContinue = document.querySelectorAll('button')[1];
}

function initialise() {
  prepareHadlers();
  getData();
  addButtonFunctionality();
  startWorkout();
}

initialise();
