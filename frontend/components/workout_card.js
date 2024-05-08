"use strict";
/**
 * EditableExercise
 * A exercise that can be updated by the user and saved to the server
 */
export class WorkoutCard extends HTMLElement {

    fullWorkout = {};

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
        this.fullWorkout = await this.getFullWorkout();
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


    buttonSoundEffect() {
        const audio = new Audio("../../audio/click_noise.mp3");
        audio.play();
    }

    addAudioTobutton() {
        const buttons = this.shadow.querySelectorAll('button');
        buttons.forEach((button) => { button.addEventListener('click', this.buttonSoundEffect.bind(this)) });
    }

    /**
     * Show the UI for when the EM is in 'readonly mode'
     */

    showReadonly() {
        this.clearShadow();
        const readonly = this.shadow.querySelector('#showWorkout');
        const clone = readonly.content.cloneNode(true);
        this.shadow.append(clone);
        this.addAudioTobutton();
        const name = this.shadow.querySelector('h4');
        const duration = this.shadow.querySelector('.duration');
        const diff = this.shadow.querySelector('.level');
        const start = this.shadow.querySelector('#start');
        // start.addEventListener('click', this.startWorkout.bind(this));
        duration.textContent = this.duration;
        name.textContent = this.textContent;
        diff.textContent = this.diff;
        const del = this.shadow.querySelector('#delete');
        const edit = this.shadow.querySelector('#edit');
        const view = this.shadow.querySelector('.view');
        this.addEventListener('click', this.classList.add('show-buttons'));
        del.addEventListener('click', this.delete.bind(this));
        edit.addEventListener('click', this.showEdit.bind(this));
        // view.addEventListener('click', this.showDetails.bind(this));
    }

    async getFullWorkout() {
        const workoutData = await this.getWorkoutData();
        const workout = JSON.parse(workoutData.exercises);
        const fullWorkout = workout.exercises;
        return fullWorkout;
    }

    getExercises() {
        const listofExercises = this.shadow.querySelector('ul');
        for (let i = 0; i < this.fullWorkout.length; i++) {
            const exerc = document.createElement('exercise-info');
            exerc.textContent = this.fullWorkout[i].name;
            exerc.desc = this.fullWorkout[i].desc;
            exerc.time = this.fullWorkout[i].time;
            exerc.index = i;
            exerc.editable = false;
            exerc.addEventListener("deleteExercise", this.deleteExercise.bind(this));
            exerc.addEventListener("editExercise", (e) => {this.editExercise(e,false);});
            listofExercises.append(exerc);
        }
        const onlyExercises = this.fullWorkout.filter((exercise) => exercise.name != 'Rest');
        return onlyExercises;
    }

    updateWorkout(exercise, action) {
        const totalDur = this.shadow.querySelector('#totalTime');
        const nOfEx = this.shadow.querySelector('#numberOfexercises');
        if ((this.fullWorkout[exercise.index].name).trim() != 'Rest' && action == 'delete') {
            nOfEx.textContent = parseInt(nOfEx.textContent) - 1;
        } else if (action == 'add') {
            nOfEx.textContent = parseInt(nOfEx.textContent) + 1;
        }

        if (action == 'delete') {
            totalDur.textContent = parseInt(totalDur.textContent) - this.fullWorkout[exercise.index].time;
        } else {
            totalDur.textContent = parseInt(totalDur.textContent) + parseInt(this.fullWorkout[exercise.index].time);
        }
    }

    deleteExercise(e) {
        const workout = this.fullWorkout.filter((exercise) => exercise != null).map((exercise) => JSON.stringify(exercise));
        console.log("exercise deleted");
        if (workout.length  > 1) {
            //fix this
            this.updateWorkout(e.target, 'delete');
            this.fullWorkout[e.target.index] = null;
        }
    }

    editExercise(e,adding) {
        if (adding == false) {
            const exercise = this.fullWorkout[e.target.index];
            this.updateWorkout(e.target, 'delete');
            exercise.name = e.target.textContent;
            exercise.desc = e.target.desc;
            exercise.time = e.target.time;
            this.updateWorkout(e.target);
        } 
        else if (adding == true) {
            const exerc = { name: e.target.textContent, desc: e.target.desc, time: e.target.time };
            this.fullWorkout.push(exerc);
            this.updateWorkout(e.target,"add");

        }
    }

    addExercise() {
        const listofExercises = this.shadow.querySelector('ul');
        const exerc = document.createElement('exercise-info');
        exerc.addEventListener("deleteExercise", this.deleteExercise.bind(this));
        exerc.addEventListener("editExercise", (e) => {this.editExercise(e,true);} );
        exerc.index = this.fullWorkout.length;
        exerc.editable = 'true';
        listofExercises.append(exerc);
    }

    async showEdit() {
        this.clearShadow();
        const readonly = this.shadow.querySelector('#editWorkout');
        const clone = readonly.content.cloneNode(true);
        this.shadow.append(clone);
        this.addAudioTobutton();
        const addExercise = this.shadow.querySelectorAll('button')[0];
        const addRest = this.shadow.querySelectorAll('button')[1];
        const cancel = this.shadow.querySelectorAll('button')[3];
        const save = this.shadow.querySelectorAll('button')[2];
        const workoutName = this.shadow.querySelector('#workoutName');
        const workoutDiff = this.shadow.querySelector('.level');
        const totalTime = this.shadow.querySelector('#totalTime');
        const numberOfExercises = this.shadow.querySelector('#numberOfexercises');
        const workoutData = await this.getWorkoutData();
        const exercises = await this.getExercises();
        numberOfExercises.textContent = exercises.length;
        totalTime.textContent = workoutData.duration;
        workoutDiff.value = workoutData.difficulty;
        workoutName.value = this.textContent;
        cancel.addEventListener("click", this.cancel.bind(this));
        save.addEventListener("click", this.save.bind(this));
        addExercise.addEventListener("click", this.addExercise.bind(this));
        addRest.addEventListener("click",this.addRest.bind(this));
        return this.shadow.querySelectorAll('exercise-info');
    }

    addRest () {
        const listofExercises = this.shadow.querySelector('ul');
        const rest = document.createElement('exercise-info');
        rest.addEventListener("deleteExercise", this.deleteExercise.bind(this));
        rest.addEventListener("editExercise", (e) => {this.editExercise(e,true);} );
        rest.index = this.fullWorkout.length;
        rest.textContent = 'Rest';
        rest.desc = 'relax';
        rest.time = 30;
        rest.editable = 'true';
        listofExercises.append(rest);
    }

    async showDetails() {
        const exercises = await this.showEdit();
        const buttons = this.shadow.querySelectorAll('button');
        const input = this.shadow.querySelector('input');
        input.disabled = true;
        const diff = this.shadow.querySelector('.level');
        diff.disabled = true;
        buttons[3].textContent = 'Show less';
        buttons[3].classList.add('view'); 
        for (let i = 0; i < buttons.length - 1; i++) {
            buttons[i].remove()
        }
        exercises.forEach((exercise) => exercise.editable = "readonly");
    }

    async startWorkout() {
        console.log(this.fullWorkout);
        const values = await this.getWorkoutData();
        console.log(values.exercises);
        sessionStorage.setItem('exercises', values.exercises);
        sessionStorage.setItem('totalTime', values.duration);

        window.location.href = "startWorkout.html"
    }


    /**
     * Show the UI for when the EM is in 'edit mode'
     */


    async cancel() {
        this.fullWorkout = await this.getFullWorkout();
        this.showReadonly();
    }

    /**
     * getter for the url attribute, necessary for the save method
     */
    get url() {
        return this.getAttribute('url');
    }

    /**
     * getter for the url attribute, necessary for the save method
     */
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

    /**
     * Need to modify that
     */
    async save() {
        const method = 'PUT';
        const headers = { 'Content-Type': 'application/json' };
        const name = this.shadow.querySelector('#workoutName').value;
        const difficulty = this.shadow.querySelector('.level').value;
        const duration = this.shadow.querySelector('#totalTime').textContent;
        const exercises = this.fullWorkout.filter((exercise) => exercise != null).map((exercise) => JSON.stringify(exercise));
        const body = JSON.stringify({ name, difficulty, duration, exercises });
        const options = { method, headers, body };
        const response = await fetch(this.url, options);
        if (response.ok) {
            this.textContent = name;
            this.diff = difficulty;
            this.duration = duration;
            this.fullWorkout = exercises.map((exercise) => JSON.parse(exercise));
            this.showReadonly();
        } else {
            console.error('Failed to save exercise');
        }
    }

}

customElements.define('workout-card', WorkoutCard);
