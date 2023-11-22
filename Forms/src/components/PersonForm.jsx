import React from 'react'

const PersonForm = ({persons, handleSubmit, newName, handleChangeName, newNumber, handleChangeNumber}) => {
  return (
    <form onSubmit={handleSubmit}>
        <div>
          name: <input value={persons.name} onChange={handleChangeName} />
        </div>
        <div>number: <input type='tel' value={persons.number} onChange={handleChangeNumber} /></div>
        <div>
          <button type="submit">add</button>
        </div>
    </form>
  )
}

export default PersonForm
