import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchPerson, setSearchPerson] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }
    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson) {
      const confirmMessage = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (confirmMessage) {
        personService
          .update(existingPerson.id, personObject)
          .then(response => {
            setPersons(persons.map(person => 
              person.id !== existingPerson.id ? person : response.data
            ))
            setNewName('')
            setNewNumber('')
          })
      }
      
    } else {
      personService
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleSearchChange = (event) => setSearchPerson(event.target.value)
  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(searchPerson.toLowerCase()))
  const handleDelete = id => {
    const person = persons.find(n => n.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .removePerson(person.id)
        .then(response => {
          setPersons(persons.filter(n => n.id !== id))
        })
    }

  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchPerson={searchPerson} handleSearchChange={handleSearchChange}/>
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete}/>
    </div>
  )
}

export default App