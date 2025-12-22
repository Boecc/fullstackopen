const Course = (props) => {
  return (
    <div>
      <Header course={props.course} />
      <Content course={props.course} />
      <Total course={props.course} />
    </div>
  )
}

const Header = (props) => <h1> {props.course.name} </h1>

const Content = ({ course }) => {
  return (
    <div>
      {course.parts.map(part => 
        <Part key={part.id}
              name={part.name}
              exercises={part.exercises}
        />
      )}
    </div>
  )
}

const Part = (props) => <p>{props.name} {props.exercises}</p>

const Total = ({ course }) => {
  const total = course.parts.reduce((s, p) => s + p.exercises, 0)
  return (
    <p><strong>total of {total} exercises</strong></p>
  )
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      }
    ]
  }


  return (
    <Course course={course}/>
  )
}

export default App
