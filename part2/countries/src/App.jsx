import { useState, useEffect } from "react"

import Content from './components/Content'
import getAll from "./services/countries"
import SearchBar from "./components/SearchBar"

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
      <SearchBar value={searchCountry} onChange={handleSearchChange} />
      <Content countryToShow={countryToShow} />
    </div>
  )
}

export default App
