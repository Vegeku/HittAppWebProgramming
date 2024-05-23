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

export class TimeSetter extends HTMLElement {

    /**
     * connectedCallback
     * When the element is added to the
     * DOM display the readonly UI
     */
    async connectedCallback() {
        this.shadow = this.attachShadow({ mode: 'open' });
        const templateURL = import.meta.url.replace('.js', '.html');
        console.log(templateURL);
        this.templatePage = await fetch(templateURL);
        this.shadow.innerHTML = await this.templatePage.text();
        this.showReadonly();
    }
  
    /**
     * Empty the shadow DOM by selecting
     * everything that's neither template
     * nor style and removing all matches. 
     */
    clearShadow() {
        const elems = this.shadow.querySelectorAll(':not(template, style)');
        elems.forEach(elem => elem.remove());
    }
  

    showReadonly() {
        this.clearShadow();
        const readonly = this.shadow.querySelector('#timer');
        const clone = readonly.content.cloneNode(true);
        this.shadow.append(clone);

        const input =  this.shadow.querySelector("#setTime");
        const t = this.shadow.querySelector('#time');
        t.value = this.time;
        input.value = this.time;
        input.addEventListener('change', this.slider.bind(this));

        const buttons = this.shadow.querySelectorAll("button");
        buttons.forEach(button => {
            button.addEventListener("click", this.buttonValue.bind(this) );
        })
    }

    buttonValue(e) {
        const t = this.shadow.querySelector('#time');
        const input =  this.shadow.querySelector("#setTime");
        const value = e.target.textContent;
        t.value = value;
        input.value = value;
        this.time = t.value;
    }

    slider () {
        const t = this.shadow.querySelector('#time');
        const input =  this.shadow.querySelector("#setTime");
        t.disabled = false;
        t.value = input.value;
        t.disabled = true;
        this.time = t.value;
    }

    get time() {
        return this.getAttribute('time');
    }

    set time(v) {
        const input =  this.shadow.querySelector("input#setTime");
        const t = this.shadow.querySelector('input#time');
        if (v) {
            this.setAttribute('time', v);
          } else {
            this.setAttribute('time', 0);
        }

        if (input && t) {
            t.value = v;
            input.value = v;
        }
    }
  

  }
  
customElements.define('time-setter', TimeSetter);
  
