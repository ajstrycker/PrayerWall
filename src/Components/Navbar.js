import React from 'react'
import windowDimensions from './WindowDimensions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {
  const { width } = windowDimensions()

  return (
    <nav className='navbar'>
      {width > 1000 ? (
        <>
          <div className='navbar__image'>
            <img src='/images/logo.png'></img>
          </div>
          <ul className='navbar__list'>
            <a href='https://www.ogbc.net/' className='navbar__list-item'>
              Home
            </a>
            <a className='navbar__list-item' href='/prayerwall'>
              Prayer Wall
            </a>
            <a className='navbar__list-item'>OUR MINISTRIES</a>
            <a className='navbar__list-item'>ABOUT US</a>
            <a className='navbar__list-item'>CONTACT US</a>
            <a className='navbar__list-item'>CALENDAR</a>
            <a className='navbar__list-item'>MESSAGES</a>
          </ul>
        </>
      ) : (
        <>
          <div className='navbar__icon'>
            <FontAwesomeIcon icon={faBars} />
          </div>
          <div className='navbar__image'>
            <img src='/images/logo.png'></img>
          </div>
        </>
      )}
    </nav>
  )
}

export default Navbar
