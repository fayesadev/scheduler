import React, { Fragment } from "react"; 
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";

export default function Appointment(props) {
  const interview = props.interview;

  return (
    <article className="appointment">
        <Header time={props.time} />
        <Fragment>
          {interview ?
          <>
            <Show student={interview.student} interviewer={interview.interviewer} /> 
          </>
          :
          <>
            <Empty />
          </>}
        </Fragment>
    </article>
  );
}