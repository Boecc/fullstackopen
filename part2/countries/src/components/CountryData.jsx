import { useState, useEffect } from "react"
import weatherService from '../services/weather'

const CountryData = ({ country }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (country.capital) {
      weatherService
        .getWeather(country.capital)
        .then(response => {
          setWeather(response.data)
        })
    }
  }, [country.capital])

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map(language =>
          <li key={language}>{language}</li>
        )}
      </ul>
      <img src={country.flags.png} />

      {weather ? (
        <div>
          <h2>Weather in {country.capital}</h2>
          <p>Temperature {weather.main.temp} Celsius</p>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
          <p>Wind {weather.wind.speed} m/s</p>

        </div>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  )
}

export default CountryData