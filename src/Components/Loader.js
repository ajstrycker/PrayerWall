import React from 'react'
import PropTypes from 'prop-types'

const Loader = ({ color }) => {
  return (
    <>
      {color === 'white' ? (
        <span className='loader loader-white'>
          <span className='loader-inner inner-white'></span>
        </span>
      ) : (
        <span className='loader loader-green'>
          <span className='loader-inner inner-green'></span>
        </span>
      )}
    </>
  )
}

export default Loader
