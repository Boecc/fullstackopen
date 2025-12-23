const Filter = ({ searchPerson, handleSearchChange }) => {
  return (
    <div>
      filter shown with <input value={searchPerson} onChange={handleSearchChange} />
    </div>
  )
}

export default Filter