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
        buttons.forEach((button) => {button.addEventListener('click',this.buttonSoundEffect.bind(this))});
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
        const start = this.shadow.querySelector('#start');
        start.addEventListener('click', this.startWorkout.bind(this));
        duration.textContent = this.duration;
        name.textContent = this.textContent;
        const del = this.shadow.querySelector('#delete');
        const edit = this.shadow.querySelector('#edit');
        const view = this.shadow.querySelector('#view');
        del.addEventListener('click', this.delete.bind(this));
        edit.addEventListener('click', this.showEdit.bind(this));
        view.addEventListener('click', this.showDetails.bind(this));
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
            listofExercises.append(exerc);
        }
        const onlyExercises = this.fullWorkout.filter((exercise) => exercise.name != 'Rest');
        return onlyExercises;
    }

    deleteExercise(e) {
        delete this.fullWorkout[e.target.index];
    }

    async showEdit() {
        this.clearShadow();
        const readonly = this.shadow.querySelector('#editWorkout');
        const clone = readonly.content.cloneNode(true);
        this.shadow.append(clone);
        this.addAudioTobutton();
        const cancel = this.shadow.querySelectorAll('button')[3];
        const workoutName = this.shadow.querySelector('#workoutName');
        const workoutDesc = this.shadow.querySelector('#workoutDesc');
        const totalTime = this.shadow.querySelector('#totalTime');
        const numberOfExercises = this.shadow.querySelector('#numberOfexercises');
        const workoutData = await this.getWorkoutData();
        const exercises = await this.getExercises();
        numberOfExercises.textContent = exercises.length;
        totalTime.textContent = workoutData.duration;
        workoutDesc.value = workoutData.description;
        workoutName.value = this.textContent;
        cancel.addEventListener("click", this.showReadonly.bind(this));
        return this.shadow.querySelectorAll('exercise-info');
    }

    async showDetails() {
        const exercises = await this.showEdit();
        const buttons = this.shadow.querySelectorAll('button');
        const inputs = this.shadow.querySelectorAll('input');
        inputs.forEach((input) => input.disabled = true);
        buttons[3].textContent = 'Show less';
        for (let i = 0; i < buttons.length - 1;i++) {
            buttons[i].remove()
        }
        exercises.forEach((exercise) => exercise.editable = "readonly");
    }

    async startWorkout() {
        const values = await this.getWorkoutData();
        console.log(values);
        sessionStorage.setItem('exercises', values.exercises);
        sessionStorage.setItem('totalTime', values.duration);

        window.location.href = "startWorkout.html"
    }


    /**
     * Show the UI for when the EM is in 'edit mode'
     */


    cancel() {
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
    // async save() {
    //     const method = 'PUT';
    //     const headers = { 'Content-Type': 'application/json' };
    //     const name = this.shadow.querySelector('h4').textContent;
    //     const description = this.shadow.querySelector('#description').value;
    //     const duration = this.shadow.querySelector('set-timer').time;
    //     const body = JSON.stringify({ name, description, duration });
    //     const options = { method, headers, body };
    //     const response = await fetch(this.url, options);
    //     if (response.ok) {
    //         this.textContent = name;
    //         this.desc = description;
    //         this.time = duration;
    //         this.showReadonly();
    //     } else {
    //         console.error('Failed to save exercise');
    //     }
    // }

}

customElements.define('workout-card', WorkoutCard);
