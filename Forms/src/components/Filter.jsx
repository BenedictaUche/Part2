const Filter = ({ newFilter, handleChange }) => {
    return (
      <div>
      <h2>Filter</h2>
      Filter shown with <input value={newFilter}  onChange={handleChange} />
      </div>
    )
  }

  export default Filter
