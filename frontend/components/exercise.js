'use strict';

/**
 * Represents an Exercise custom element.
 * @extends HTMLElement
 */
export class Exercise extends HTMLElement {
  /**
   * Lifecycle method called when the element is connected to the DOM.
   * @returns {Promise<void>}
   */
  async connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'open' });
    const templateURL = import.meta.url.replace('.js', '.html');
    const styleURL = import.meta.url.replace('.js', '.css');
    this.templatePage = await fetch(templateURL);
    this.itemStyle = await fetch(styleURL);
    this.shadow.innerHTML = (await this.templatePage.text());
    this.shadow.innerHTML += `<style> ${await this.itemStyle.text()}  </style>`;

    if (this.editable === 'true' || this.editable === 'create') {
      this.editExercise();
    } else if (this.editable === 'readonly') {
      this.readonly();
    } else {
      this.showExercise();
    }
  }

  /**
   * Clears the shadow DOM by removing all elements except template and style.
   */
  clearShadow() {
    const elems = this.shadow.querySelectorAll(':not(template, style)');
    elems.forEach(elem => elem.remove());
  }

  /**
   * Displays the exercise in read-only mode.
   */
  showExercise() {
    this.clearShadow();
    const readonly = this.shadow.querySelector('#showExecise');
    const clone = readonly.content.cloneNode(true);
    this.shadow.append(clone);
    const delButton = this.shadow.querySelectorAll('button')[0];
    const editButton = this.shadow.querySelectorAll('button')[1];
    const name = this.shadow.querySelectorAll('p')[0];
    const description = this.shadow.querySelectorAll('p')[1];
    const time = this.shadow.querySelectorAll('p')[2];
    name.textContent = this.textContent;
    description.textContent = this.desc;
    time.textContent = this.time;
    delButton.addEventListener('click', this.deleteExercise.bind(this));
    editButton.addEventListener('click', this.editExercise.bind(this));
  }

  deleteExercise() {
    const deleteEvent = new CustomEvent('deleteExercise', {
      bubbles: true,
      detail: { index: this.index, time: this.time },
    });
    this.dispatchEvent(deleteEvent);
  }

  /**
   * Displays the exercise in read-only mode without any buttons.
   */
  readonly() {
    this.showExercise();
    const buttons = this.shadow.querySelectorAll('button');
    buttons.forEach((button) => { button.remove(); });
  }


  /**
   * Performs error checking on the exercise form.
   * @returns {boolean} - True if there are no errors, false otherwise.
   */
  errorChecking() {
    const error = this.shadow.querySelector('#error');
    error.textContent = '';
    const newTime = this.shadow.querySelector('time-setter');
    const newDesc = this.shadow.querySelector('#description');
    const newName = this.shadow.querySelector('#exercise');
    if (newDesc.value.trim() === '') {
      error.textContent += 'Description cannot be empty. ';
    }
    if (newName.value.trim() === '') {
      error.textContent += 'Name cannot be empty. ';
    }
    if (newTime.time === '0') {
      error.textContent += 'Time cannot be 0. ';
    }

    if (newDesc.value.trim() !== '' && newName.value.trim() !== '' && newTime.time !== '0') {
      return true;
    } else {
      error.style.display = 'block';
      return false;
    }
  }

  /**
   * Displays the exercise in edit mode.
   */
  editExercise() {
    this.clearShadow();
    const edit = this.shadow.querySelector('#addExercise');
    const clone = edit.content.cloneNode(true);
    this.shadow.append(clone);
    const newTime = this.shadow.querySelector('time-setter');
    const newDesc = this.shadow.querySelector('#description');
    const newName = this.shadow.querySelector('#exercise');
    newTime.time = this.time;
    newDesc.value = this.desc;
    newName.value = this.textContent;
    const save = this.shadow.querySelector('#send');
    save.value = 'Save';
    const cancel = this.shadow.querySelector('#cancelExercise');
    save.addEventListener('click', this.saveExerciseEdit.bind(this));
    cancel.addEventListener('click', this.cancel.bind(this));
    // if create do something, if edit do something (add event listener to depend on the value of editable attribute)
  }

  /**
   * Saves the edited exercise.
   */
  saveExerciseEdit() {
    const newTime = this.shadow.querySelector('time-setter');
    const newDesc = this.shadow.querySelector('#description');
    const newName = this.shadow.querySelector('#exercise');
    const oldTime = this.time;
    this.time = newTime.time;
    this.desc = newDesc.value.trim();
    this.textContent = newName.value.trim();

    if (this.errorChecking()) {
      const editEvent = new CustomEvent('editExercise', {
        bubbles: true,
        detail: { index: this.index, currentTime: oldTime, time: this.time, desc: this.desc },
      });
      this.dispatchEvent(editEvent);
      this.showExercise();
    }
  }

  cancel() {
    if (this.editable === 'create') {
      this.remove();
    } else if (this.errorChecking()) {
      this.showExercise();
    }
  }


  /**
   * Gets the editable attribute value.
   * @returns {string} - The value of the editable attribute.
   */
  get editable() {
    return this.getAttribute('editable');
  }

  /**
   * Sets the editable attribute value.
   * @param {string} value - The value to set for the editable attribute.
   */
  set editable(value) {
    if (value === 'true' || value === 'false' || value === 'readonly' || value === 'create') {
      this.setAttribute('editable', value);
    } else {
      this.setAttribute('editable', false);
    }
  }

  /**
   * Gets the index attribute value.
   * @returns {string} - The value of the index attribute.
   */
  get index() {
    return this.getAttribute('index');
  }

  /**
   * Sets the index attribute value.
   * @param {string} value - The value to set for the index attribute.
   */
  set index(value) {
    this.setAttribute('index', value);
  }

  /**
   * Gets the desc attribute value.
   * @returns {string} - The value of the desc attribute.
   */
  get desc() {
    return this.getAttribute('desc');
  }

  /**
   * Sets the desc attribute value.
   * @param {string} value - The value to set for the desc attribute.
   */
  set desc(value) {
    this.setAttribute('desc', value);
  }

  /**
   * Gets the time attribute value.
   * @returns {string} - The value of the time attribute.
   */
  get time() {
    return this.getAttribute('time');
  }

  /**
   * Sets the time attribute value.
   * @param {string} value - The value to set for the time attribute.
   */
  set time(value) {
    this.setAttribute('time', value);
  }
}

customElements.define('exercise-info', Exercise);
