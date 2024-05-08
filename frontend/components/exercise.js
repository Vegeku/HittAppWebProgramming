'use strict';

export class Exercise extends HTMLElement {
  /**
     * connectedCallback
     * When the element is added to the
     * DOM display the readonly UI
     */
  async connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'open' });
    const templateURL = import.meta.url.replace('.js', '.html');
    this.templatePage = await fetch(templateURL);
    this.shadow.innerHTML = await this.templatePage.text();

    if (this.editable == 'true') {
      this.editExercise();
    } else if (this.editable === 'readonly') {
      this.readonly();
    } else {
      this.showExercise();
    }
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

  readonly() {
    this.showExercise();
    const buttons = this.shadow.querySelectorAll('button');
    buttons.forEach((button) => { button.remove(); });
  }

  cancelElement() {
    if (this.editable === 'true') {
      this.remove();
    } else { 
      this.showExercise();
    }
  }

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
      return false;
    }
  }

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
    cancel.addEventListener('click', this.cancelElement.bind(this));
  }

  saveExerciseEdit() {
    const error = this.shadow.querySelector('#error');
    const newTime = this.shadow.querySelector('time-setter');
    const newDesc = this.shadow.querySelector('#description');
    const newName = this.shadow.querySelector('#exercise');
    this.time = newTime.time;
    this.desc = newDesc.value.trim();
    this.textContent = newName.value.trim();
    const editEvent = new CustomEvent('editExercise', {
      bubbles: true,
      detail: { index: this.index, time: this.time, desc: this.desc },
    });

    const addEvent = new CustomEvent('addExercise', {
      bubbles: true,
      detail: {time: this.time, desc: this.desc, name: this.textContent},
    });

    if (this.errorChecking()) {
      this.dispatchEvent(editEvent);
      this.dispatchEvent(addEvent);
      this.showExercise();
    }
  }

  deleteExercise() {
    this.remove();
    const event = new CustomEvent('deleteExercise', {
      bubbles: true,
      detail: { index: this.index },
    });
    this.dispatchEvent(event);
  }

  get editable() {
    return this.getAttribute('editable');
  }

  set editable(value) {
    if (value === 'true' || value === 'false' || value === 'readonly') {
      this.setAttribute('editable', value);
    } else {
      this.setAttribute('editable', false);
    }
  }


  get index() {
    return this.getAttribute('index');
  }

  set index(value) {
    this.setAttribute('index', value);
  }

  get desc() {
    return this.getAttribute('desc');
  }

  set desc(value) {
    this.setAttribute('desc', value);
  }

  get time() {
    return this.getAttribute('time');
  }

  set time(value) {
    this.setAttribute('time', value);
  }
}

customElements.define('exercise-info', Exercise);
