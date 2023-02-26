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

  const id = interview.interviewer;
  const interviewerData = state.interviewers[id];

  interview.interviewer = interviewerData;

  return interview;
}