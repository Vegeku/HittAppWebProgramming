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
        console.log(workoutData.exercises);
        const workout = JSON.parse(workoutData.exercises);
        const fullWorkout = workout.exercises;
        return fullWorkout;
    }

    errorChecking() {
        const error = this.shadow.querySelector('#error');
        console.log(error);
        error.textContent = '';
        const workoutName = this.shadow.querySelector('#workoutName').value.trim();
        const workoutDiff = this.shadow.querySelector('.level').value;

        if (workoutName === '') {
            error.textContent += 'Workout name cannot be empty. ';
        }

        if (workoutDiff === '') {
            error.textContent += 'Workout difficulty cannot be empty. ';
        }

        if (this.fullWorkout.filter((exercise) => exercise != 'null').length === 1) {
            error.textContent += 'Workout must have at least one exercise. ';
        }

        if (workoutName !== '' && workoutDiff !== '' && this.fullWorkout.length > 0) {
            return true;
        } else {
            return false;
        }
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
            exerc.addEventListener("editExercise", (e) => { this.editExercise(e, false); });
            listofExercises.append(exerc);
        }
        const onlyExercises = this.fullWorkout.filter((exercise) => exercise.name != 'Rest');
        return onlyExercises;
    }

    updateWorkout(exercise, action) {
        const totalDur = this.shadow.querySelector('#totalTime');
        const nOfEx = this.shadow.querySelector('#numberOfexercises');
        let totalDuration = parseInt(totalDur.textContent);
        let exerciseCount = parseInt(nOfEx.textContent);
        console.log(totalDur);

        if (action === 'delete') {
            totalDuration -= parseInt(exercise.time);
            exerciseCount--;
        } else if (action === 'add') {
            totalDuration += parseInt(exercise.time);
            exerciseCount++;
        }

        totalDur.textContent = totalDuration;
        nOfEx.textContent = exerciseCount;
    }

    isOnlyExerciseLeft() {
        const exercises = this.fullWorkout.filter((exercise) => exercise !== null && exercise.name.trim() !== 'Rest');
        return exercises.length === 1;
    }


    deleteExercise(e) {
        const workout = this.fullWorkout.filter((exercise) => exercise != null).map((exercise) => JSON.stringify(exercise));
        if (this.errorChecking()) {
            console.log("exercise deleted");
            e.target.remove();
            this.updateWorkout(e.target, 'delete');
            this.fullWorkout[e.target.index] = null;
        }
    }

    editExercise(e, adding) {
        if (adding == false) {
            const exercise = this.fullWorkout[e.target.index];
            this.updateWorkout(e.target, 'delete');
            exercise.name = e.target.textContent;
            exercise.desc = e.target.desc;
            exercise.time = e.target.time;
            this.updateWorkout(e.target, 'add');
        }
        else if (adding == true) {
            const exerc = { name: e.target.textContent, desc: e.target.desc, time: e.target.time };
            this.fullWorkout.push(exerc);
            this.updateWorkout(e.target, "add");

        }
    }


    addExercise() {
        const listofExercises = this.shadow.querySelector('ul');
        const exerc = document.createElement('exercise-info');
        exerc.addEventListener("deleteExercise", this.deleteExercise.bind(this));
        exerc.addEventListener("editExercise", (e) => { this.editExercise(e, true); });
        exerc.index = this.fullWorkout.length;
        exerc.editable = 'true';
        listofExercises.append(exerc);
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
        const exercises = await this.getExercises();
        numberOfExercises.textContent = exercises.length;
        totalTime.textContent = workoutData.duration;
        workoutDiff.value = workoutData.difficulty;
        workoutName.value = this.textContent;
        cancel.addEventListener("click", this.cancel.bind(this));
        save.addEventListener("click", this.save.bind(this));
        addExercise.addEventListener("click", this.addExercise.bind(this));
        addRest.addEventListener("click", this.addRest.bind(this));
        return this.shadow.querySelectorAll('exercise-info');
    }

    addRest() {
        const listofExercises = this.shadow.querySelector('ul');
        const rest = document.createElement('exercise-info');
        rest.addEventListener("deleteExercise", this.deleteExercise.bind(this));
        rest.addEventListener("editExercise", (e) => { this.editExercise(e, true); });
        rest.index = this.fullWorkout.length;
        rest.textContent = 'Rest';
        rest.desc = 'relax';
        rest.time = 30;
        rest.editable = 'true';
        listofExercises.append(rest);
    }


    startInitialTimer() {
        const starting = this.shadow.querySelector('#startWorkout');
        starting.showModal();
        const initialTimer = this.shadow.querySelector('#startWorkout > p');

        let currentValue = parseInt(initialTimer.textContent);
        initialTimer.textContent = "3";
        let interval = setInterval(() => {
            if (currentValue > 0) {
                console.log(currentValue);
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
        console.log(values);
        const exercs = JSON.stringify(this.fullWorkout);
        console.log(JSON.stringify(this.fullWorkout));
        sessionStorage.setItem('exercises', exercs);
        sessionStorage.setItem('totalTime', values.duration);


        setTimeout(() => { window.location.href = "startWorkout.html" }, 5000);
    }





    async cancel() {
        const cancel = this.shadow.querySelector('#showEdit');
        console.log(cancel);
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
        console.log("save");

        if (!this.errorChecking()) {
            return;
        }

        const method = 'PUT';
        const headers = { 'Content-Type': 'application/json' };
        const name = this.shadow.querySelector('#workoutName').value;
        const difficulty = this.shadow.querySelector('.level').value;
        const duration = this.shadow.querySelector('#totalTime').textContent;
        const exercises = this.fullWorkout.filter((exercise) => exercise != null);
        const body = JSON.stringify({ name, difficulty, duration, exercises });
        const options = { method, headers, body };
        const response = await fetch(this.url, options);
        if (response.ok) {
            this.textContent = name;
            this.diff = difficulty;
            this.duration = duration;
            this.fullWorkout = exercises;
            this.showReadonly();
        } else {
            console.error('Failed to save exercise');
        }
    }

}

customElements.define('workout-card', WorkoutCard);
