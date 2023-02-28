import { useState, useEffect } from "react";
import { getAppointmentsForDay } from "helpers/selectors";
import axios from "axios";

export default function useApplicationData(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({...state, day});

  useEffect(()=> {
    const daysURL = '/api/days';
    const appointmentsURL = '/api/appointments';
    const interviewersURL = '/api/interviewers';

    Promise.all([
      axios.get(daysURL),
      axios.get(appointmentsURL),
      axios.get(interviewersURL)

    ]).then ((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    })
  }, []);

  const updateSpots = function(state, day, difference = 0) {
    const appointments = getAppointmentsForDay(state, day);
    let count = 0 - difference;

    for (let appointment of appointments) {
      if (!appointment.interview) {
        count += 1;
      }
    };
    return count;
  }

  const bookInterview = function(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, {interview})
    .then((res) => {

      const spotDifference = state.appointments[id].interview ? 0 : 1;
      const spots = updateSpots(state, state.day, spotDifference);

      const foundDayIndex = state.days.findIndex((someDay) => someDay.name === state.day);
      
      const dayListHead = state.days.slice(0, foundDayIndex);
      const dayListTail = state.days.slice(foundDayIndex + 1);

      const newDay = {...state.days[foundDayIndex], spots};
      const newDayList = dayListHead.concat(newDay).concat(dayListTail);
  
      setState({...state, appointments, days: newDayList});

      return res.status
    });
    
  };

  const cancelInterview = function(id) {

    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`)
    .then((res) => {
      setState({...state, appointments});
      return res.status
    });
  };

  return { state, setDay, bookInterview, cancelInterview };
}