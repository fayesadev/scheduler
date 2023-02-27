export function getAppointmentsForDay(state, day) {
  if (state.days.length === 0) {
    return [];
  };

  let apptArr

  for (let obj of state.days) {
    if (obj.name === day) {
      apptArr = obj.appointments;
    }
  };

  if (!apptArr) {
    return [];
  };

  let final = [];

  for (let appt of apptArr) {
    final.push(state.appointments[appt]);
  };

  return final;
};

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  return {...interview, interviewer: state.interviewers[interview.interviewer]};
}

export function getInterviewersForDay(state, day) {
  if (state.days.length === 0) {
    return [];
  };

  let interviewersArr

  for (let obj of state.days) {
    if (obj.name === day) {
      interviewersArr = obj.interviewers;
    }
  };

  if (!interviewersArr) {
    return [];
  };

  let final = [];

  for (let interviewer of interviewersArr) {
    final.push(state.interviewers[interviewer]);
  };

  return final;
};