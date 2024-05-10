'use strict';

export function soundEffect(type) {
  let audio;
  if (type === 'button') {
    audio = new Audio('../audio/click_noise.mp3');
  } else if (type === 'beep') {
    audio = new Audio('../audio/short-beep-countdown.mp3');
  }
  audio.play();
}

export function soundNorElem() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => button.addEventListener('click', () => { soundEffect('button'); }));
}

export function soundCustElem() {
  const buttons = this.shadow.querySelectorAll('button');
  buttons.forEach((button) => button.addEventListener('click', () => { soundEffect('button'); }));
}
