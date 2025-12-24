const Content = ({ countryToShow }) => {

  if (countryToShow.length > 10) {
    return <div>Too many matches, specify another filter</div>
  } else if (countryToShow.length === 1) {
    const country = countryToShow[0]
    const languagesObject = country.languages
    const languages = Object.values(languagesObject)

    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>Capital {country.capital}</p>
        <p>Area {country.area}</p>
        <h2>Languages</h2>
        <ul>{languages.map(language =><li key={language}>{language}</li>)}</ul>
        <img src={country.flags.png} />
      </div>
    )
  }
  return (
    <ul>{countryToShow.map(country => <li key={country.name.common}>{country.name.common}</li>)}</ul>
  )
}

export default Content