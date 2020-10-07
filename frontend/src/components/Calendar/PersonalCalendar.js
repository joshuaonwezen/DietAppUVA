import React from 'react'

import './Calendar.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

const localizer = momentLocalizer(moment)

class PersonalCalendar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            events: []
        }

        this.getEvents = this.getEvents.bind(this)
        this.showEvent = this.showEvent.bind(this)
    }

    getEvents = async username => {
        var that = this;
        console.log(username);
        if (username !== undefined) {
            try {
                await fetch(`https://dscs.cloudno.de/eventget?username=${username}`, {
                    crossDomain: true,
                    mode: 'cors',
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    }
                })
                    .then(response => response.json())
                    .then(function (response) {
                        var data = response
                        console.log(data)
                        that.setState({ events: data });
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } catch (err) {
                console.log(err)
            }
        }
    }

    showEvent(data) {
        this.props.setEvent(data)
        this.props.navigate('event')
    }

    componentDidMount() {
        this.getEvents(this.props.user[0].username)
    }

    render() {
        return (
            <div>
                <h2>My Events</h2>
                <Calendar
                    localizer={localizer}
                    events={this.state.events}
                    startAccessor='start'
                    endAccessor='end'
                    className="calendar"
                    onSelectEvent={this.showEvent}
                />
            </div>
        )
    }
}
export default PersonalCalendar
