import React from 'react'

const Persons = ({showFilteredList}) => {
  return (
    <div>
        {showFilteredList()}

    </div>
  )
}

export default Persons
