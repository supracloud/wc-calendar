import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import calendarStyle from '@fullcalendar/core/main.css';
import daygridStyle from '@fullcalendar/daygrid/main.min.css';
import timegridStyle from '@fullcalendar/timegrid/main.min.css';

export class FrmdbCalendar extends HTMLElement {

    constructor() {
        super();

        const template = document.createElement('template');
        template.innerHTML = `<style>${calendarStyle}</style><style>${daygridStyle}</style><style>${timegridStyle}</style><div id = "calendar"></div>`;

        this._sR = this.attachShadow({ mode: 'open' });
        this._sR.appendChild(template.content.cloneNode(true));

        this.open = false;

        this.calendarEl = this._sR.getElementById('calendar');
        this.calendar = new Calendar(this.calendarEl, {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
            header: {
                left: 'prev,next',
                center: 'title',
                right: 'timeGridDay,timeGridWeek,dayGridMonth'
            },
            defaultView: 'timeGridWeek',
            editable: true,
            eventResize: info => this.onEventChanged(info.event),
            eventDrop: info => this.onEventChanged(info.event),
            eventSources: [{
                id: 'frmdb-src',
                events: (info, success, failure) => {
                    let re = [];
                    this.querySelectorAll('frmdb-calendar-event').forEach(el => {
                        re.push({ title: el.title, start: el.start, end: el.end, allDay: el.allDay });
                        el.addEventListener('change', () => this.fetchEvents());
                    });
                    success(re);
                }
            }]
        });

        this.calendar.render();
    }

    fetchEvents() {
        this.calendar.getEventSourceById('frmdb-src').refetch();
    }

    onEventChanged(event) {
        this.dispatchEvent(new CustomEvent('frmdbCalendarEventChanged', { detail: event }));
    }

    connectedCallback() {
        new MutationObserver(() => {
            this.fetchEvents();
        }).observe(this, { childList: true });
    }

    static get observedAttributes() {
        return ['options'];
    }

    get options() {
        return JSON.parse(this.getAttribute('options'));
    }

    set options(value) {
        this.setAttribute('options', JSON.stringify(value));
    }

    attributeChangedCallback(name, oldVal, newVal) {
        this.render();
    }

    render() {

    }
}