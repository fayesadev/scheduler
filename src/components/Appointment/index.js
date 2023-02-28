import React from "react"; 
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Error from "./Error";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = function(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);

    props.bookInterview(props.id, interview)
    .then(() => {
      // console.log("res", res)
      transition(SHOW)
    })
    .catch(error => {
      transition(ERROR_SAVE, true);
    })
  };

  const cancel = function() {
    transition(DELETING, true);

    props.cancelInterview(props.id)
    .then(() => {
      // console.log("res", res);
      transition(EMPTY);
    })
    .catch(error => {
      transition(ERROR_DELETE, true);
    })
  };

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === CREATE && (
        <Form 
          interviewers={props.interviewers} 
          onSave={save}
          onCancel={back}
        />
      )}
      {mode === SAVING && <Status message="Saving..." />}
      {mode === ERROR_SAVE && (
        <Error 
          message="Oops! It didn't save. Please try again later." 
          onClose={back}
        />
      )}
      {mode === DELETING && <Status message="Deleting..." />}
      {mode === ERROR_DELETE && (
        <Error
          message="Oops! It didn't delete. Please try again later."
          onClose={back}
        />
      )}
      {mode === CONFIRM && (
        <Confirm 
          message="Are you sure you want to delete?" 
          onCancel={back} 
          onConfirm={() => cancel()} 
        />)}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={() => transition(EDIT)}
          onDelete={() => transition(CONFIRM)}
        />
      )}
      {mode === EDIT && (
        <Form 
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      )}
    </article>
  );
}