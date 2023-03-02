import React from "react";

import { render, cleanup, waitForElement, fireEvent, prettyDOM, getByText, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, queryByAltText, getByDisplayValue } from "@testing-library/react";

import Application from "components/Application";
import axios from "axios";

afterEach(cleanup);

describe("Application", () => {
  
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
  
    await waitForElement(() => getByText("Monday"));
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  
  });
  
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async() => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Add" button on the first empty appointment.
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0]

    fireEvent.click(getByAltText(appointment, "Add"));

    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 5. Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

      // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"));

    // 7. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    // 8. Wait until the element with the text "Lydia Miller-Jones" is displayed.
    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

    // 9. Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "Delete" button on the first appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    )

    fireEvent.click(queryByAltText(appointment, "Delete"))

    // 4. Check that the confirmation message is shown
    expect(getByText(appointment, "Are you sure you want to delete?")).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting..." is displayed.
    expect(getByText(appointment,"Deleting...")).toBeInTheDocument();

    // 7. Wait until an empty element with the "Add" button is displayed
    await waitForElement(() => queryByAltText(appointment, "Add"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();

    // debug();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async() => {
    // 1. Render the Application
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Edit" button on the first shown appointment (Archie)
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Edit"));
    
    // 4. Check if the name "Archie Cohen" is in the input with placeholder "Enter Student Name"
    expect(getByDisplayValue(appointment, "Archie Cohen")).toBeInTheDocument();

    // 5. Check if the interviewer with name "Tori Malcolm" is shown on the list
    expect(getByText(appointment, "Tori Malcolm")).toBeInTheDocument();

    // 6. Enter the name "Lydia Miller-Jones" into the input with placeholder "Enter Student Name"
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 7. Click the first interviewer in the list
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 8. Click the "Save" button
    fireEvent.click(getByText(appointment, "Save"));

    // 9. Check element with text "Saving" is displayed
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    // 10. Wait until element with text "Lydia Miller-Jones is displayed"
    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

    // 11. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

    // debug();

  });

  it("shows the save error when failing to save an appointment", async() => {
    // Return a fake error
    axios.put.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Add" button on the first empty appointment.
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0]

    fireEvent.click(getByAltText(appointment, "Add"));

    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 5. Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"));

    //7. Check if error message shows up with text "Oops! It didn't save. Please try again later." 
    await waitForElement(() => getByText(appointment, "Error"));

    expect(getByText(appointment, "Oops! It didn't save. Please try again later.")).toBeInTheDocument();

    //8. Click on button with alt text "Close"
    fireEvent.click(getByAltText(appointment, "Close"))

    //9. Check if form renders with placeholder Enter Student Name
    expect(getByPlaceholderText(appointment, "Enter Student Name")).toBeInTheDocument();

    // debug()
  });

  it("shows the delete error when failing to delete an existing appointment", async() => {
    axios.delete.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the first appointment
    const appointment = getAllByTestId(container, "appointment").find(
    appointment => queryByText(appointment, "Archie Cohen")
    )

    fireEvent.click(queryByAltText(appointment, "Delete"))

    // 4. Check that the confirmation message is shown
    expect(getByText(appointment, "Are you sure you want to delete?")).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation
    fireEvent.click(getByText(appointment, "Confirm"));

    //6. Check for deleting message
    expect(getByText(appointment,"Deleting...")).toBeInTheDocument();

    //7. Check if error message shows up with text "Oops! It didn't delete. Please try again later." 
    await waitForElement(() => getByText(appointment, "Error"));

    expect(getByText(appointment, "Oops! It didn't delete. Please try again later.")).toBeInTheDocument();

    //8. Click on button with alt text "Close"
    fireEvent.click(getByAltText(appointment, "Close"));

    //9. Check if appointment renders with Archie Cohen displayed (did not delete)
    expect(getByText(appointment, "Archie Cohen")).toBeInTheDocument();

    debug();
  })
});