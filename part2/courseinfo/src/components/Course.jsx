const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

const Header = ({ course }) => <h1> {course.name} </h1>

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

export default Course