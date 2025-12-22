import { useState } from 'react'

const Header = ({ content }) => <h1>{content}</h1>

const Button = ({ onClick, text }) => <button onClick={onClick}> {text} </button>

const StatisticLine = ({ text, value }) => <p> {text} {value} </p>

const Content = ({ handleGood, handleNeutral, handleBad }) => {
  return (
    <div>
      <Button onClick={handleGood} text='good' />
      <Button onClick={handleNeutral} text='neutral' />
      <Button onClick={handleBad} text='bad' />
    </div>
  )
}

const Statistics = (props) => {
  if (props.all === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <div>
      <StatisticLine text='good' value={props.good} />
      <StatisticLine text='neutral' value={props.neutral} />
      <StatisticLine text='bad' value={props.bad} />
      <StatisticLine text='all' value={props.all} />
      <StatisticLine text='average' value={props.average} />
      <StatisticLine text='positive' value={props.positive} />
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(good + 1)
  const handleNeutral = () => setNeutral(neutral + 1)
  const handleBad = () => setBad(bad + 1)

  const total = good + neutral + bad

  return (
    <div>
      <Header content='give feedback' />
      <Content
        handleGood={handleGood}
        handleNeutral={handleNeutral}
        handleBad={handleBad}
      />
      <Header content='statistics' />
      <Statistics 
        good={good} 
        neutral={neutral} 
        bad={bad} 
        all={total}
        average = {((good - bad) / total).toFixed(2)}
        positive = {((good / total) * 100).toFixed(2) + '%'}
      />
    </div>
  )
}

export default App