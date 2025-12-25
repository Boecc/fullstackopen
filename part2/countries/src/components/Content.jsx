import CountryData from "./CountryData"

const Content = ({ countryToShow, handleShow }) => {

  if (countryToShow.length > 10) {
    return <div>Too many matches, specify another filter</div>
  } else if (countryToShow.length === 1) {
    return (
      <CountryData country={countryToShow[0]} />
    )
  }
  return (
    <ul>
      {countryToShow.map(country =>
        <li key={country.name.common}>
          {country.name.common}
          <button onClick={() => handleShow(country.name.common)}>Show</button>
        </li>)}
    </ul>
  )
}

export default Content