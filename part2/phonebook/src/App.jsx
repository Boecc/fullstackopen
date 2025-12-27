import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'
import personService from './services/persons'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [searchPerson, setSearchPerson] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])



  const addPerson = (personObject) => {
    const existingPerson = persons.find(person => person.name === personObject.name)
    if (existingPerson) {
      const confirmMessage = window.confirm(`${personObject.name} is already added to phonebook, replace the old number with a new one?`)
      if (confirmMessage) {
        personService
          .update(existingPerson.id, personObject)
          .then(response => {
            setNotificationType('success')
            setPersons(persons.map(person =>
              person.id !== existingPerson.id ? person : response.data
            ))
            setNotificationMessage(`Updated number for ${existingPerson.name}`)
            setTimeout(() => setNotificationMessage(null), 5000)
          })
          .catch(error => {
            setNotificationType('error')
            setNotificationMessage(
              `Error: ${existingPerson.name} was already removed from server`
            )
            setTimeout(() => setNotificationMessage(null), 5000)
            setPersons(persons.filter(n => n.id !== existingPerson.id))
          })
          
      }
    } else {
      personService
        .create(personObject)
        .then(response => {
          setNotificationType('success')
          setPersons(persons.concat(response.data))
          setNotificationMessage(`Added ${personObject.name}`)
          setTimeout(() => setNotificationMessage(null), 5000)
        })
        .catch( error => {
          console.log(error.response.data.error);
          setNotificationType('error')
          setNotificationMessage(
            error.response.data.error
          )
          setTimeout(() => setNotificationMessage(null), 5000)
        })
    }
  }

  const handleSearchChange = (event) => setSearchPerson(event.target.value)
  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(searchPerson.toLowerCase()))

  const handleDelete = id => {
    const person = persons.find(n => n.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .removePerson(person.id)
        .then(response => {
          setNotificationType('success')
          setPersons(persons.filter(n => n.id !== id))
          setNotificationMessage(`${person.name} deleted`)
          setTimeout(() => setNotificationMessage(null), 5000)
        })
        .catch(error => {
          setNotificationType('error')
          setNotificationMessage(
            `Error: ${person.name} aleady removed from server`
          )
          setTimeout(() => setNotificationMessage(null), 5000)
          setPersons(persons.filter(n => n.id !== person.id))
        })
        
    }

  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} type={notificationType}/>
      <Filter searchPerson={searchPerson} handleSearchChange={handleSearchChange} />
      <h2>add a new</h2>
      <PersonForm createPerson={addPerson} />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App