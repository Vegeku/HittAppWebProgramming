"use strict";

export class WorkoutCard extends HTMLElement {

    fullWorkout = {};

    async connectedCallback() {
        this.shadow = this.attachShadow({ mode: 'open' });
        const templateURL = import.meta.url.replace('.js', '.html');
        this.templatePage = await fetch(templateURL);
        this.shadow.innerHTML = await this.templatePage.text();
        this.fullWorkout = await this.getFullWorkout();
        this.showReadonly();
    }


    clearShadow() {
        const elems = this.shadow.querySelectorAll(':not(template, style)');
        elems.forEach(elem => elem.remove());
    }



    showReadonly() {
        this.clearShadow();
        const readonly = this.shadow.querySelector('#showWorkout');
        const clone = readonly.content.cloneNode(true);
        this.shadow.append(clone);
        const name = this.shadow.querySelector('h4');
        const duration = this.shadow.querySelector('.duration');
        const diff = this.shadow.querySelector('#diff');
        const start = this.shadow.querySelector('#start');
        start.addEventListener('click', this.startWorkout.bind(this));
        duration.textContent = this.duration;
        name.textContent = this.textContent;
        diff.textContent = this.diff;
        const del = this.shadow.querySelector('#delete');
        const edit = this.shadow.querySelector('#edit');
        const view = this.shadow.querySelector('.view');
        this.addEventListener('click', this.classList.add('show-buttons'));
        del.addEventListener('click', this.delete.bind(this));
        edit.addEventListener('click', this.showEdit.bind(this));
    }

    async getFullWorkout() {
        const workoutData = await this.getWorkoutData();
        const workout = JSON.parse(workoutData.exercises);
        const fullWorkout = workout;
        return fullWorkout;
    }

    errorChecking() {
        const error = this.shadow.querySelector('#error');
        error.textContent = '';
        const workoutName = this.shadow.querySelector('#workoutName').value.trim();
        const workoutDiff = this.shadow.querySelector('.level').value;

        if (workoutName === '') {
            error.textContent += 'Workout name cannot be empty. ';
        }

        if (workoutDiff === '') {
            error.textContent += 'Workout difficulty cannot be empty. ';
        }

        if (Object.keys(this.fullWorkout).length === 0) {
            error.textContent += 'Workout must have at least one exercise. ';
        }

        if (workoutName !== '' && workoutDiff !== '' && Object.keys(this.fullWorkout).length > 0) {
            return true;
        } else {
            return false;
        }
    }


    createExercises() {
        const listofExercises = this.shadow.querySelector('ul');
        for (const key in this.fullWorkout) {
            const exerc = document.createElement('exercise-info');
            exerc.textContent = this.fullWorkout[key].name;
            exerc.desc = this.fullWorkout[key].desc;
            exerc.time = this.fullWorkout[key].time;
            exerc.index = key;
            exerc.editable = 'false';
            exerc.addEventListener("deleteExercise", this.deleteExercise.bind(this));
            exerc.addEventListener("editExercise", this.editExercise.bind(this));
            listofExercises.append(exerc);
        }
        return this.getNumberOfExercises();
    }

    editExercise(e) {
        const totalTime = this.shadow.querySelector('#totalTime');
        this.fullWorkout[e.target.index] = { name: e.target.textContent, desc: e.target.desc, time: e.target.time };
        totalTime.textContent = parseInt(totalTime.textContent) - parseInt(e.detail.currentTime) + parseInt(e.target.time);
    }

    deleteExercise(e) {
        const totalTime = this.shadow.querySelector('#totalTime');
        const numberOfExercises = this.shadow.querySelector('#numberOfexercises');
        totalTime.textContent = parseInt(totalTime.textContent) - parseInt(e.target.time);
        delete this.fullWorkout[e.target.index];
        if (e.target.textContent !== "Rest") {
            numberOfExercises.textContent = parseInt(numberOfExercises.textContent) - 1;
        }
        e.target.remove();
    }

    getNumberOfExercises() {
        let Nofexercises = 0;
        for (const key of Object.keys(this.fullWorkout)) {
            if (this.fullWorkout[key].name !== "Rest") {
                Nofexercises++;
            }
        }
        return Nofexercises;

    }


    async showEdit() {
        const showEdit = this.shadow.querySelector('#showEdit');
        showEdit.showModal();
        const addExercise = this.shadow.querySelectorAll('button')[1];
        const addRest = this.shadow.querySelectorAll('button')[2];
        const cancel = this.shadow.querySelectorAll('button')[4];
        const save = this.shadow.querySelectorAll('button')[3];
        const workoutName = this.shadow.querySelector('#workoutName');
        const workoutDiff = this.shadow.querySelector('.level');
        const totalTime = this.shadow.querySelector('#totalTime');
        const numberOfExercises = this.shadow.querySelector('#numberOfexercises');
        const workoutData = await this.getWorkoutData();
        const exercises = await this.createExercises();
        numberOfExercises.textContent = exercises;
        totalTime.textContent = workoutData.duration;
        workoutDiff.value = workoutData.difficulty;
        workoutName.value = this.textContent;
        cancel.addEventListener("click", this.cancel.bind(this));
        save.addEventListener("click", this.save.bind(this));
        addExercise.addEventListener("click", this.addExercise.bind(this));
        addRest.addEventListener("click", this.addRest.bind(this));
        return this.shadow.querySelectorAll('exercise-info');
    }

    addtoListOrEdit(e) {
        const totalTime = this.shadow.querySelector('#totalTime');
        const numberOfExercises = this.shadow.querySelector('#numberOfexercises');
        if (e.target.editable === 'create') {
          const payload = { name: e.target.textContent, desc: e.target.desc, time: e.target.time };
          this.fullWorkout[e.target.index] = payload;
          if (e.target.textContent !== 'Rest') {
            numberOfExercises.textContent = parseInt(numberOfExercises.textContent) + 1;
          }
          totalTime.textContent = parseInt(totalTime.textContent) + parseInt(e.target.time);
          console.log(listofExercises);
          e.target.editable = 'false';
        } else {
            this.editExercise(e) 
        }
    }

    addRest() {
        const listofExercises = this.shadow.querySelector('ul');
        const exercise = document.createElement('exercise-info');
        exercise.editable = 'create';
        exercise.textContent = 'Rest';
        exercise.desc = 'Rest';
        exercise.index = crypto.randomUUID();
        listofExercises.append(exercise);
        exercise.addEventListener('deleteExercise', this.deleteExercise.bind(this));
        exercise.addEventListener('editExercise', this.addtoListOrEdit.bind(this));
    }
      
    addExercise() {
        const listofExercises = this.shadow.querySelector('ul');
        const exercise = document.createElement('exercise-info');
        exercise.editable = 'create';
        exercise.index = crypto.randomUUID();
        listofExercises.append(exercise);
        exercise.addEventListener('deleteExercise', deleteExercise);
        exercise.addEventListener('deleteExercise', this.deleteExercise.bind(this));
        exercise.addEventListener('editExercise', this.addtoListOrEdit.bind(this));
    }


    startInitialTimer() {
        const starting = this.shadow.querySelector('#startWorkout');
        starting.showModal();
        const initialTimer = this.shadow.querySelector('#startWorkout > p');

        let currentValue = parseInt(initialTimer.textContent);
        initialTimer.textContent = "3";
        let interval = setInterval(() => {
            if (currentValue > 0) {
                currentValue--;
                initialTimer.textContent = currentValue;
            } else {
                clearInterval(interval);
                initialTimer.textContent = "start Workout!";
            }
        }, 1000);
    }

    async startWorkout() {
        const starting = this.shadow.querySelector('#startWorkout');
        this.startInitialTimer()
        const values = await this.getWorkoutData();
        const exercs = JSON.stringify(this.fullWorkout);
        sessionStorage.setItem('exercises', exercs);
        sessionStorage.setItem('totalTime', values.duration);


        setTimeout(() => { window.location.href = "startWorkout.html" }, 5000);
    }





    async cancel() {
        const cancel = this.shadow.querySelector('#showEdit');
        this.fullWorkout = await this.getFullWorkout();
        cancel.close();
        this.showReadonly();
    }

    get url() {
        return this.getAttribute('url');
    }

    set url(value) {
        if (value) {
            this.setAttribute('url', value);
        } else {
            this.removeAttribute('url');
        }
    }

    get dbid() {
        return this.getAttribute('dbid');
    }


    get duration() {
        return this.getAttribute('dur');
    }

    set duration(value) {
        if (value) {
            this.setAttribute('dur', value);
        } else {
            this.setAttribute('dur', 0);
        }
    }

    get diff() {
        return this.getAttribute('diff');
    }

    set diff(value) {
        if (value === 'easy' || value === 'medium' || value === 'hard') {
            this.setAttribute('diff', value);
        } else {
            this.setAttribute('diff', 'easy');
        }
    }

    async getWorkoutData() {
        const response = await fetch(this.url);
        if (response.ok) {
            const values = await response.json();
            return values;
        }
        return {};
    }

    async delete() {
        this.parentElement.remove();
        this.remove();
        const method = 'DELETE';
        const headers = { 'Content-Type': 'application/json' };
        const name = this.shadow.querySelector('h4').textContent;
        const body = JSON.stringify({ name });
        const options = { method, headers, body };
        await fetch(this.url, options);
    }

    async save() {

        if (this.errorChecking()) {
            const method = 'PUT';
            const headers = { 'Content-Type': 'application/json' };
            const name = this.shadow.querySelector('#workoutName').value;
            const difficulty = this.shadow.querySelector('.level').value;
            const duration = this.shadow.querySelector('#totalTime').textContent;
            const exercises = JSON.stringify(this.fullWorkout);
            const body = JSON.stringify({ name, difficulty, duration, exercises });
            const options = { method, headers, body };
            const response = await fetch(this.url, options);
            if (response.ok) {
                this.textContent = name;
                this.diff = difficulty;
                this.duration = duration;
                this.showReadonly();
            } else {
                console.error('Failed to save exercise');
            }
        }
    }

}

customElements.define('workout-card', WorkoutCard);
