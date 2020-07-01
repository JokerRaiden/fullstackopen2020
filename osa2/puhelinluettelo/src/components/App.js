import React, { useState, useEffect } from 'react'
import personService from '../services/persons'
import './App.css'

const Notification = ({ successMessage, errorMessage }) => {
  if (!successMessage && !errorMessage) {
    return null
  }

  if (successMessage) {
    return (
      <div className="success">
        {successMessage}
      </div>
    )
  }
  else if (errorMessage) {
    return (
      <div className="error">
        {errorMessage}
      </div>
    )
  }
}

const Person = ({person, handleDelete}) => {
  return (
    <div>
      {person.name} {person.number}
      <button onClick={handleDelete}>delete</button>
    </div>
  )
}

const Persons = ({personsToShow, handleDelete}) => {
  return (
    <div>
      {personsToShow.map( person => 
      <Person key={person.name} person={person} handleDelete={() => handleDelete(person.name, person.id)} />
    )}
    </div>
  )
}

const Filter = ({newFilter, handleNewFilter}) => {
  return (
    <div>
      filter shown with <input value={newFilter} onChange={handleNewFilter} />
    </div>
  )
}

const PersonForm = ({ addPerson, newName, handleNewName, newNumber, handleNewNumber }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNewName}/>
        <br/>
        number: <input value={newNumber} onChange={handleNewNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [ errorMessage, setErrorMessage ] = useState('')
  const [ successMessage, setSuccessMessage ] = useState('')

  useEffect(() => {
    personService
      .getAll()
        .then(initialPersons => {
          setPersons(initialPersons)
        })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    let existingPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
    if (existingPerson) {
      if(!window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        return
      }
    }

    const newPerson = {
      name: newName,
      number: newNumber
    }

    if (existingPerson) {
      personService
        .update(existingPerson.id, newPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
            setSuccessMessage(
              `Updated ${returnedPerson.name}`
            )
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
          })
          .catch(error => {
            setErrorMessage(
              `Information of ${existingPerson.name} has already been removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPersons(persons.filter(person => person.id !== existingPerson.id))
          })
    }
    else {
      personService.create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(
            `Added ${returnedPerson.name}`
          )
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
      })
    }
    
  }

  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNewFilter = (event) => {
    setNewFilter(event.target.value)
  }

  const handleDelete = (name, id) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id)
      .then(response => {
        setPersons(persons.filter(person => person.id !== id))
        setSuccessMessage(
          `Deleted ${name}`
        )
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
    }
  }
  const personsToShow = persons.filter(person => person.name.toLowerCase().startsWith(newFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification errorMessage={errorMessage} successMessage={successMessage} />
      <Filter newFilter={newFilter} handleNewFilter={handleNewFilter} />
      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} handleNewName={handleNewName} newNumber={newNumber} handleNewNumber={handleNewNumber} />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App