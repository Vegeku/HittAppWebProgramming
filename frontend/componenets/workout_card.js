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
        const readonly = this.shadow.querySelector('#showWorkout');
        const clone = readonly.content.cloneNode(true);
        this.shadow.append(clone);
        const name = this.shadow.querySelector('h4');
        const duration = this.shadow.querySelector('.duration');
        const start = this.shadow.querySelector('#start');
        start.addEventListener('click', this.startWorkout.bind(this));
        duration.textContent = this.duration; 
        name.textContent = this.textContent;
        const del = this.shadow.querySelector('#delete');
        const edit = this.shadow.querySelector('#edit');
        del.addEventListener('click',this.delete.bind(this));
        edit.addEventListener('click',this.showEdit.bind(this));
    }

    showEdit() {
        this.clearShadow();
        const readonly = this.shadow.querySelector('#editWorkout');
        const clone = readonly.content.cloneNode(true);
        this.shadow.append(clone);
        const cancel = this.shadow.querySelectorAll('button')[3];
        const workoutName = this.shadow.querySelector('#workoutName');
        workoutName.value = this.textContent;
        console.log(cancel);
        cancel.addEventListener("click", this.showReadonly.bind(this));
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
        const method = 'DELETE';
        const headers = { 'Content-Type': 'application/json' };
        const name = this.shadow.querySelector('h4').textContent;
        const body = JSON.stringify({ name });
        const options = { method, headers, body };
        await fetch(this.url, options);
    }

}

customElements.define('workout-card', WorkoutCard);
