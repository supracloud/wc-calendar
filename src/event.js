export class FrmdbCalendarEvent extends HTMLElement {
    constructor() {
        super();
    }
    static get observedAttributes() {
        return ['title', 'start', 'end', 'allDay'];
    }

    get start() {
        return this.getAttribute('start');
    }

    set start(val) {
        this.setAttribute('start', val);
    }

    get end() {
        return this.getAttribute('end');
    }

    set end(val) {
        this.setAttribute('end', val);
    }

    get title() {
        return this.getAttribute('title');
    }

    set title(val) {
        this.setAttribute('title', val);
    }

    get allDay() {
        return this.getAttribute('allDay') || false;
    }

    set allDay(val) {
        this.setAttribute('allDay', val);
    }

    get event() {
        return {
            title: this.getAttribute('title'),
            start: new Date(this.getAttribute('start')),
            end: new Date(this.getAttribute('end')),
            allDay: this.getAttribute('allDay')
        };
    }

    attributeChangedCallback(name, oldVal, newVal) {
        this.dispatchEvent(new CustomEvent('change'));
    }

    render() { }
}