"use strict";

// export class AnalogClock extends HTMLElement {
//     constructor() {
//       super();
//       const shadow = this.attachShadow({ mode: 'closed' });

//       shadow.innerHTML = `
//           <svg viewbox="-55 -55 110 110">
//             <style>
//               circle {
//                 fill: none;
//                 stroke: currentColor;
//               }
//               line {
//                 stroke: currentColor;
//                 stroke-linecap: square;
//               }
//             </style>
//             <circle id="face" cx="0" cy="0" r="50" />
//             <circle id="hours" cx="0" cy="0" r="45" stroke-dasharray="4 19.5 2 21.5 2 21.5 3 20 2 21.5 2 21.5 4 19.5 2 21.5 2 21.5 3 20 2 21.5 2 21.5" stroke-width="6%" style="transform: rotateZ(-91.5deg)" />

//             <line id="hh" x1="0" x2="0" y1="0" y2="-30" stroke-width="10%"/>
//             <line id="mm" x1="0" x2="0" y1="0" y2="-38" stroke-width="5%"/>
//             <line id="ss" x1="0" x2="0" y1="0" y2="-45" stroke-width="1%"/>
//           </svg>`;
//       this.hh = shadow.querySelector('#hh');
//       this.mm = shadow.querySelector('#mm');
//       this.ss = shadow.querySelector('#ss');
//       this.update();
//     }

//     update() {
//       const timeNow = new Date();
//       const hour = timeNow.getHours() % 12 * 30 + (timeNow.getMinutes() / 3);
//       const mins = timeNow.getMinutes() * 6;
//       const secs = timeNow.getSeconds() * 6;

//       this.hh.style = this.hasAttribute('hours')
//       ? `transform: rotateZ(${hour}deg)`: 'display: none;';
//       this.mm.style = this.hasAttribute('minutes')
//       ?`transform: rotateZ(${mins}deg)`: 'display: none;';
//       this.ss.style = this.hasAttribute('seconds')
//         ? `transform: rotateZ(${secs}deg)`
//         : 'display: none;';
//     }

//     connectedCallback() {
//       this.intervalID = window.setInterval(this.update.bind(this), 1000);
//     }

//     disconnectedCallback() {
//       this.intervalID = window.clearInterval(this.intervalID);
//     }
//   }

//   customElements.define('analog-clock', AnalogClock);

class TimerSetting extends HTMLElement {
    // https://www.youtube.com/watch?v=1GT35DSdZbI

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'closed' });

        shadow.innerHTML = '<input type="number" name="minutes" min="0" max="60" value="59" /> : <input type="number" name="seconds" min="0" max="59" value="0"/>'
    }

    connectedCallback() {
        this.
    }

    // disconnectedCallback() {

    // }

    // adoptedconnectedCallback() {

    // }

    // attributeChangedCallback() {

    // }


}

customElements.define("setting-timer", TimerSetting);

// class TimerSetting extends HTMLElement {
//     // https://www.youtube.com/watch?v=1GT35DSdZbI

//     constructor() {
//         super();
//         const shadow = this.attachShadow({ mode: 'closed' });

//         shadow.innerHTML = '<input type="number" name="minutes" min="0" max="60" value="59" /> : <input type="number" name="seconds" min="0" max="59" value="0"/>'
//     }

//     connectedCallback() {
//         this.
//     }

//     // disconnectedCallback() {

//     // }

//     // adoptedconnectedCallback() {

//     // }

//     // attributeChangedCallback() {

//     // }


// }

