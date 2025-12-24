import { useState, useEffect } from "react"

import getAll from "./services/countries"

const Filter = ({ countryToShow }) => {
  
  if (countryToShow.length > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  } else if (countryToShow.length === 1) {
    const country = countryToShow[0]
    const languagesObject = country.languages
    const languages = Object.values(languagesObject)
    console.log(country);
    
    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>Capital {country.capital}</p>
        <p>Area {country.area}</p>
        <h2>Languages</h2>
        <ul>
          {languages.map(language =>
            <li key={language}>{language}</li>
          )}
        </ul>
        <img src={country.flags.png} />
      </div>
    )
  }
  return(
    <ul>
        {countryToShow.map(country => <li key={country.name.common}>{country.name.common}</li>)}
      </ul>
  )
}

const App = () => {

  const [countries, setCountries] = useState([])
  const [searchCountry, setSearchCountry] = useState('')

  useEffect(() => {
    getAll()
    .then(response => {
      setCountries(response.data)
    })
  }, [])

  const handleSearchChange = (event) => {
    setSearchCountry(event.target.value)
  }

  const countryToShow = countries.filter(country => country.name.common.toLowerCase().includes(searchCountry.toLowerCase()))

  return (
    <div>
      <div>
        find countries: <input onChange={handleSearchChange}/>
      </div>

      <Filter countryToShow={countryToShow} />
    </div>
  )
}

export default App
