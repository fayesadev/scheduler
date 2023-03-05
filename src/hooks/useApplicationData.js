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

  // Gets days, appointments and interviewers data from API call
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

  // Sets state of updated number of spots remaining for Day List
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

  //Makes a put request and sets state when user books an interview
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

  //Makes a delete request and set state when user cancels or destroys an interview
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