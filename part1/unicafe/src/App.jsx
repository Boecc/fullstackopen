import { useState } from 'react'

const Header = ({ content }) => <h1>{content}</h1>

const Button = ({ onClick, text }) => <button onClick={onClick}> {text} </button>

const Statistics = ({ statistic, count }) => <p> {statistic} {count} </p>

const Content = ({ handleGood, handleNeutral, handleBad }) => {
  return (
    <div>
      <Button onClick={handleGood} text='good' />
      <Button onClick={handleNeutral} text='neutral' />
      <Button onClick={handleBad} text='bad' />
    </div>
  )
}

const Info = (props) => {
  return (
    <div>
      <Statistics statistic='good' count={props.good} />
      <Statistics statistic='neutral' count={props.neutral} />
      <Statistics statistic='bad' count={props.bad} />
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

  return (
    <div>
      <Header content='give feedback' />
      <Content
        handleGood={handleGood}
        handleNeutral={handleNeutral}
        handleBad={handleBad}
      />
      <Header content='statistics' />
      <Info good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App