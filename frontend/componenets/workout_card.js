/**
 * EditableExercise
 * A exercise that can be updated by the user and saved to the server
 */
export class WorkoutCard extends HTMLElement {

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

    /**
     * Show the UI for when the EM is in 'readonly mode'
     */
    showReadonly() {
        this.clearShadow();
        const readonly = this.shadow.querySelector('#workout');
        const clone = readonly.content.cloneNode(true);
        this.shadow.append(clone);
        const name = this.shadow.querySelector('h4');
        const duration = this.shadow.querySelector('.duration');
        const level = this.shadow.querySelector('.level');
        const start = this.shadow.querySelector('#start');
        start.addEventListener('click', this.startWorkout.bind(this));
        duration.textContent = this.duration;
        level.textContent = this.level;
        const del = this.shadow.querySelector('#delete');
        del.addEventListener('click',this.delete.bind(this));
    }

    async startWorkout() {
        const response = await fetch(this.url);
        const values = await response.json();
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

    get level() {
        return this.getAttribute('level');
    }

    set level(value) {
        if (value) {
            this.setAttribute('level', value);
        } else {
            this.setAttribute('level', 'Easy');
        }
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

    /**
     * Send a PUT request to the server with the new exercise.
     * The URL for the fetch request comes from the
     * URL attribute of this custom element
     */
    async delete() {
        // const exercise = this.shadow.querySelector('.editable-exercise');
        // exercise.replaceChildren();
        // exercise.remove();
        this.parentElement.remove();
        this.remove();
        const method = 'DELETE';
        const headers = { 'Content-Type': 'application/json' };
        const name = this.shadow.querySelector('h4').textContent;
        const body = JSON.stringify({ name });
        const options = { method, headers, body };
        const response = await fetch(this.url, options);
        // console.log(response);
        // if (response.ok) {
        //   // this.showReadonly();
        // } else {
        //   console.error('Failed to save exercise');
        // }
    }

}

customElements.define('workout-card', WorkoutCard);
