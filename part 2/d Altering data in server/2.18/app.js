import React, { useState, useEffect } from "react";

import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";

import personsService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    personsService
      .getAll()
      .then((persons) => setPersons(persons))
      .catch((error) => {
        alert(`An error occured on server. Can't load persons.`);
      });
  }, []);

  const addName = (event) => {
    event.preventDefault();
    if (!persons.some((person) => person.name === newName)) {
      const nameObject = {
        name: newName,
        number: newNumber,
      };

      personsService
        .create(nameObject)
        .then((newPerson) => {
          setPersons(persons.concat(newPerson));
          setNewName("");
          setNewNumber("");
        })
        .catch((error) => {
          alert(`An error occured on server. ${newName} was not added.`);
        });
    } else if (
      window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
    ) {
      const person = persons.find((p) => p.name === newName);
      const updatedPerson = {
        ...person,
        number: newNumber,
      };
      personsService
        .update(person.id, updatedPerson)
        .then((returnedPerson) => {
          setPersons(
            persons.map((p) => (p.id !== person.id ? p : returnedPerson))
          );
          setNewName("");
          setNewNumber("");
        })
        .catch((error) => {
          alert(`An error occured on server. ${newName} was not updated.`);
        });
    }
  };

  const handleDeleteClick = (event) => {
    let person = persons.find((p) => p.name === event.target.value);
    window.confirm(`Delete ${person.name}`) &&
      personsService
        .erase(person.id)
        .then((response) => {
          setPersons(persons.filter((p) => p.id !== person.id));
        })
        .catch((error) => {
          alert(
            `An error occured on server. ${event.target.value} was not deleted.`
          );
        });
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchName = (event) => {
    setSearchName(event.target.value);
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter value={searchName} handler={handleSearchName} />

      <h2>Add a new</h2>

      <PersonForm
        submit={addName}
        name={newName}
        nameHandler={handleNameChange}
        number={newNumber}
        numberHandler={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons list={personsToShow} deleteHandle={handleDeleteClick} />
    </div>
  );
};

export default App;
