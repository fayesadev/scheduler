import React from "react";
import DayListItem from "components/DayListItem"

export default function DayList(props) {
  const days = props.days;

  const dayListItems = days.map((day) => 
    <DayListItem
      key={day.id}
      name={day.name}
      spots={day.spots}
      selected={day.name === props.value}
      setDay={() => props.onChange(day.name)}
    />
  );

  return (
    <ul>{dayListItems}</ul>
  );
}