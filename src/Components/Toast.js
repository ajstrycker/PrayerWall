import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle,
  faExclamationCircle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'

const Toast = (props) => {
  const { toastList, position } = props
  const [list, setList] = useState(toastList)
  const { autoDelete, autoDeleteTime } = props

  useEffect(() => {
    setList(toastList)
  }, [toastList, list])

  useEffect(() => {
    console.log('use effect')
    const interval = setInterval(() => {
      if (autoDelete && toastList.length && list.length) {
        deleteToast(toastList[0].id)
      }
    }, autoDeleteTime)
    return () => {
      clearInterval(interval)
    }
  }, [list])

  const deleteToast = (id) => {
    const index = list.findIndex((e) => e.id === id)
    list.splice(index, 1)
    const toastListItem = toastList.findIndex((e) => e.id === id)
    toastList.splice(toastListItem, 1)
    setList([...list])
  }

  return (
    <>
      <div className={`notification-container ${position}`}>
        {list.map((toast, i) => (
          <div
            key={i}
            className={`notification toast ${position} ${
              toast.type === 'error' ? 'toast-fail' : 'toast-success'
            }`}
          >
            <button onClick={() => deleteToast(toast.id)}>X</button>
            <div className='notification-icon'>
              <FontAwesomeIcon
                icon={
                  toast.type === 'error' ? faExclamationCircle : faCheckCircle
                }
              />
            </div>
            <div>
              <p className='notification-title'>{toast.title}</p>
              <p className='notification-message'>{toast.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

Toast.defaultProps = {
  position: 'bottom-right',
}

Toast.propTypes = {
  toastList: PropTypes.array.isRequired,
  position: PropTypes.string,
  autoDelete: PropTypes.bool,
  autoDeleteTime: PropTypes.number,
}

export default Toast
