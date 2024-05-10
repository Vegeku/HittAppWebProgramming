/**
 * Represents a custom HTML element for setting time.
 * @class
 * @extends HTMLElement
 */
export class TimeSetter extends HTMLElement {
  /**
   * Called when the element is connected to the DOM.
   * Initializes the shadow DOM, fetches the template, and displays the timer.
   * @async
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
   * Clears the shadow DOM by removing all elements except for <template> and <style>.
   */
  clearShadow() {
    const elems = this.shadow.querySelectorAll(':not(template, style)');
    elems.forEach(elem => elem.remove());
  }

  /**
   * Displays the timer by cloning the template and setting up event listeners.
   */
  showTimer() {
    this.clearShadow();
    const readonly = this.shadow.querySelector('#timer');
    const clone = readonly.content.cloneNode(true);
    this.shadow.append(clone);

    const input = this.shadow.querySelector('#setTime');
    const t = this.shadow.querySelector('#time');
    t.textContent = this.time;
    input.value = this.time;
    input.addEventListener('input', this.slider.bind(this));

    const buttons = this.shadow.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('click', this.buttonValue.bind(this));
    });
  }

  /**
   * Event listener for button clicks.
   * Updates the timer value based on the clicked button.
   * @param {Event} e - The button click event.
   */
  buttonValue(e) {
    const t = this.shadow.querySelector('#time');
    const input = this.shadow.querySelector('#setTime');
    const value = e.target.textContent;
    t.textContent = value;
    input.value = value;
    this.time = t.textContent;
  }

  /**
   * Event listener for slider input.
   * Updates the timer value based on the slider input.
   */
  slider() {
    const t = this.shadow.querySelector('#time');
    const input = this.shadow.querySelector('#setTime');
    t.textContent = input.value;
    this.time = t.textContent;
  }

  /**
   * Gets the current time value.
   * @returns {string} The current time value.
   */
  get time() {
    return this.getAttribute('time');
  }

  /**
   * Sets the time value.
   * If the value is truthy, it sets the attribute to the value.
   * If the value is falsy, it sets the attribute to 0.
   * @param {string} v - The time value to set.
   */
  set time(v) {
    if (v) {
      this.setAttribute('time', v);
    } else {
      this.setAttribute('time', 0);
    }
  }
}

customElements.define('time-setter', TimeSetter);
