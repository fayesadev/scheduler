import React from "react";
import classNames from "classnames";
import "components/styles/InterviewerListItem.scss";

export default function InterviewerListItem(props) {

  const interviewerClass = classNames('interviewers__item', {
    "interviewers__item--selected": props.selected
  });
  
  const displayName = function(props) {
    return (props.selected ? props.name : "");
  };

  return (
    <li onClick={props.setInterviewer} className={interviewerClass}>
      <img
      className="interviewers__item-image"
      src={props.avatar}
      alt={props.name}
      />
      {displayName(props)}
    </li>
  );
}