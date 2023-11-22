import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import axios from 'axios';
import './index.css';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');
  const [errorMessage, setNewErrorMessage] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!newName || !newNumber) {
      setNewErrorMessage({ message: 'Please enter both name and number.', type: 'error' });
      setTimeout(() => {
        setNewErrorMessage(null);
      }, 5000);
      return;
    }

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    if (existingPerson) {
      const confirmReplacement = window.confirm(
        `${newName} is already added to the phonebook, replace the old number with the new one?`
      );

      if (confirmReplacement) {
        personService
          .update(existingPerson.id, { name: newName, number: newNumber })
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : returnedPerson
              )
            );
            setNewName('');
            setNewNumber('');
            setNewErrorMessage({ message: 'Contact updated successfully.', type: 'success' });
            setTimeout(() => {
              setNewErrorMessage(null);
            }, 5000);
          })
          .catch((error) => {
            setNewErrorMessage({ message: 'Error updating contact.', type: 'error' });
            setTimeout(() => {
              setNewErrorMessage(null);
            }, 5000);
          });
      }
      return;
    }

    personService
      .create({ name: newName, number: newNumber })
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName('');
        setNewNumber('');
        setNewErrorMessage({ message: 'Contact added successfully.', type: 'success' });
        setTimeout(() => {
          setNewErrorMessage(null);
        }, 5000);
      })
      .catch((error) => {
        setNewErrorMessage({ message: 'Error adding contact.', type: 'error' });
        setTimeout(() => {
          setNewErrorMessage(null);
        }, 5000);
      });
  };

  const handleChangeName = (event) => {
    setNewName(event.target.value);
  };

  const handleChangeNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const handleChangeFilter = (event) => {
    setNewFilter(event.target.value);
  };

  const handleDelete = (id, name) => {
    const result = window.confirm(`Delete ${name}?`);
    if (result) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setNewErrorMessage({ message: 'Contact deleted successfully.', type: 'success' });
          setTimeout(() => {
            setNewErrorMessage(null);
          }, 5000);
        })
        .catch((error) => {
          setNewErrorMessage({ message: 'Error deleting contact.', type: 'error' });
          setTimeout(() => {
            setNewErrorMessage(null);
          }, 5000);
        });
    }
  };

  const showFilteredList = () => {
    if (newFilter === '') {
      return persons.map((person) => (
        <div key={person.id}>
          {person.name}: {person.number}{' '}
          <button onClick={() => handleDelete(person.id, person.name)}>
            Delete
          </button>
        </div>
      ));
    }

    return persons
      .filter((person) =>
        person.name.toLowerCase().includes(newFilter.toLowerCase())
      )
      .map((person) => (
        <div key={person.id}>
          {person.name}: {person.number}{' '}
          <button onClick={() => handleDelete(person.id, person.name)}>
            Delete
          </button>
        </div>
      ));
  };

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  return (
    <div>
      {errorMessage && <div className={errorMessage.type}>{errorMessage.message}</div>}
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} handleChange={handleChangeFilter} />
      <h2>Add a new contact</h2>
      <PersonForm
        persons={persons}
        handleSubmit={handleSubmit}
        handleChangeName={handleChangeName}
        handleChangeNumber={handleChangeNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} showFilteredList={showFilteredList} />
    </div>
  );
};

export default App;
