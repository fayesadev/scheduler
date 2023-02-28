import { renderHook, act } from "@testing-library/react-hooks";
import { getAppointmentsForDay } from "helpers/selectors";
// import { setDay, updateSpots, bookInterview, cancelInterview } from "hooks/useApplicationData";

const updateSpots = function(state, day) {
  const appointments = getAppointmentsForDay(state, day);
  let count = 0;

  for (let appointment of appointments) {
    if (!appointment.interview) {
      count += 1;
    }
  };
  return count;
}

const state = {
  days: [
    {
      id: 1,
      name: "Monday",
      appointments: [1, 2, 3],
      interviewers: [2]
    },
    {
      id: 2,
      name: "Tuesday",
      appointments: [4, 5],
      interviewers: [1, 2]
    }
  ],
  appointments: {
    "1": { id: 1, time: "12pm", interview: null },
    "2": { id: 2, time: "1pm", interview: null },
    "3": {
      id: 3,
      time: "2pm",
      interview: { student: "Archie Cohen", interviewer: 2 }
    },
    "4": {
      id: 4,
      time: "3pm",
      interview: { student: "Faye Dumbrigue", interviewer: 1 }
    },
    "5": {
      id: 5,
      time: "4pm",
      interview: { student: "Chad Takahashi", interviewer: 2 }
    }
  },
  interviewers: {
    "1": {  
      "id": 1,
      "name": "Sylvia Palmer",
      "avatar": "https://i.imgur.com/LpaY82x.png"
    },
    "2": {
      id: 2,
      name: "Tori Malcolm",
      avatar: "https://i.imgur.com/Nmx0Qxo.png"
    }
  }
};

test("updateSpots returns 2 for Monday", () => {
  const result = updateSpots(state, "Monday");
  expect(result).toEqual(2);
});

test("updateSpots returns 0 for Tuesday", () => {
  const result = updateSpots(state, "Tuesday");
  expect(result).toEqual(0);
});

test("updateSpots returns 0 for Tuesday", () => {
  const result = updateSpots(state, "Tuesday");
  expect(result).toEqual(0);
});