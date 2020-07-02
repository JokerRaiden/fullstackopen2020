import React from 'react'
import Person from './Person'

const Persons = ({personsToShow, handleDelete}) => {
  return (
    <div>
      {personsToShow.map( person => 
      <Person key={person.name} person={person} handleDelete={() => handleDelete(person.name, person.id)} />
    )}
    </div>
  )
}

export default Persons