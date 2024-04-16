"use strict";

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
        } else if (this.editable == "readonly") {
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
        const name = this.shadow.querySelectorAll('p')[0]
        const description = this.shadow.querySelectorAll('p')[1]
        const time = this.shadow.querySelectorAll('p')[2]
        name.textContent = this.textContent;
        description.textContent = this.desc;
        time.textContent = this.time;
        delButton.addEventListener('click',this.deleteExercise.bind(this));
        editButton.addEventListener('click',this.editExercise.bind(this));
    }

    readonly() {
        this.showExercise();
        const buttons = this.shadow.querySelectorAll('button');
        buttons.forEach((button) => {button.remove()});
    }

    editExercise() {
        this.clearShadow();
        const edit = this.shadow.querySelector('#addExercise');
        const clone = edit.content.cloneNode(true);
        this.shadow.append(clone);
        const save = this.shadow.querySelector('#send');
        save.value = "Save";
        const cancel = this.shadow.querySelector('#cancelExercise');
        save.addEventListener("click",this.saveExerciseEdit.bind(this));
        cancel.addEventListener("click",this.showExercise.bind(this));

    }

    saveExerciseEdit() {
        this.showExercise()
        const newTime = this.shadow.querySelector('time-setter');
        const newDesc = this.shadow.querySelector('#description');
        const newName = this.shadow.querySelector('exercise');
        this.time = newTime.time;
        this.desc = newDesc.value;
        this.textContent = newName.value;
    }

    deleteExercise() {
        this.remove();
        const event = new CustomEvent('deleteExercise', {
            bubbles: true,
            detail: { index: this.index }
        });
        this.dispatchEvent(event);
    }

    get editable() {
        return this.getAttribute('editable');
    }
    
    set editable(value) {
        if(value == 'true' || value == 'false' || value == "readonly") {
            return this.setAttribute('editable',value);
        } else {
            return this.setAttribute('editable',false); 
        }
    }
    

    get index() {
        return this.getAttribute('index');
    }

    set index(value) {
        return this.setAttribute('index',value);
    }

    get desc() {
        return this.getAttribute('desc');
    }

    set desc(value) {
        return this.setAttribute('desc',value);
    }

    get time() {
        return this.getAttribute('time');
    }

    set time(value) {
        return this.setAttribute('time',value);
    }


}

customElements.define('exercise-info', Exercise);

