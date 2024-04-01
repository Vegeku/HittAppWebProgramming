"use strict";

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
        this.showTimer();
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
  

    showTimer() {
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
        // ask why this doesn't work
        // const input =  this.shadow.querySelector("input#setTime");
        // const t = this.shadow.querySelector('input#time');
        if (v) {
            this.setAttribute('time', v);
          } else {
            this.setAttribute('time', 0);
        }

        // if (input && t) {
        //     t.value = v;
        //     input.value = v;
        // }
    }
  

  }
  
customElements.define('time-setter', TimeSetter);
  
