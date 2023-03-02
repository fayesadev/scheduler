import { useState, useEffect } from "react";
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

  const updateSpots = function(state, appointments, id) {
    const dayObj = state.days.find(d => d.name === state.day);

    let count = 0

    for (let id of dayObj.appointments) {
      const appointment = appointments[id];
      if (!appointment.interview) {
        count ++;
      }
    };

    const day = {...dayObj, spots: count};
    return state.days.map(d => d.name === state.day ? day : d)
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

      const days = updateSpots(state, appointments);
      setState(prev => ({...prev, days, appointments}));

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

      const days = updateSpots(state, appointments);
      setState(prev => ({...prev, days, appointments}));
      
      return res.status
    });
  };

  return { state, setDay, bookInterview, cancelInterview };
}