import React from "react";

const Persons = ({ list }) =>
  list.map((person) => (
    <p key={person.name}>
      {person.name} {person.number}
    </p>
  ));

export default Persons;
