import React, { useState, useEffect } from 'react'
import windowDimensions from './WindowDimensions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faBars,
  faChevronRight,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {
  const { width: ScreenWidth } = windowDimensions()

  // state for slide navar
  const [isVisable, setIsVisable] = useState(false)
  const [navWidth, setNavWidth] = useState('0')
  const [padding, setPadding] = useState('0')
  const [iconOpacity, setIconOpacity] = useState('0')
  const [navItems, setNavitems] = useState([])
  const [visibleNavItems, setVisibleNavItems] = useState([])
  const [prevNavItems, setPrevNavItems] = useState([])
  const [level, setLevel] = useState(1)

  const toggleSlideNav = () => {
    setIsVisable(!isVisable)
  }

  if (ScreenWidth > 1000 && isVisable) setIsVisable(false)

  const GetNavItems = () => {
    fetch('NavItems.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then(function (res) {
        return res.json()
      })
      .then(function (myJson) {
        setNavitems(myJson)
      })
  }

  useEffect(() => {
    if (navItems) {
      setVisibleNavItems(navItems)
    }
  }, [navItems])

  useEffect(() => {
    GetNavItems()
  }, [])

  useEffect(() => {
    if (visibleNavItems.length === 0 && navItems) {
      setVisibleNavItems(navItems)
    }
  }, [visibleNavItems])

  useEffect(() => {
    if (isVisable) {
      requestAnimationFrame(() => {
        setNavWidth('75%')

        setTimeout(() => {
          setPadding('2rem')
          setIconOpacity('1')
        }, 200)
      })
    } else {
      requestAnimationFrame(() => {
        setNavWidth('0')
        setIconOpacity('0')

        setTimeout(() => {
          setPadding('0')
          setVisibleNavItems(navItems)
          setLevel(1)
        }, 200)
      })
    }
  }, [isVisable])

  const GetNextNavItems = (title) => {
    visibleNavItems.map((item) => {
      if (item.title === title) {
        setPrevNavItems(visibleNavItems)
        setVisibleNavItems(item.sub)
        setLevel(level + 1)
      }
    })
  }

  const GoBack = () => {
    if (level > 2) {
      setVisibleNavItems(prevNavItems)
    } else {
      setVisibleNavItems(navItems)
    }
    setLevel(level - 1)
  }

  return (
    <>
      <nav className='navbar'>
        {ScreenWidth > 1000 ? (
          <>
            <div className='navbar__image'>
              <img src='/images/logo.png' alt='logo'></img>
            </div>
            <ul className='navbar__list'>
              {navItems.map((item, i) => (
                <li className='navbar__list-item'>
                  <a href={item.url}>{item.title}</a>

                  {item.sub.length !== 0 && (
                    <ul className='navbar__submenu'>
                      {item.sub.map(
                        (subitem) =>
                          subitem.title !== item.title && (
                            <li>
                              <a href={subitem.url}>
                                {subitem.title}
                                {subitem.sub.length !== 0 && (
                                  <span>
                                    <FontAwesomeIcon
                                      icon={faChevronRight}
                                    ></FontAwesomeIcon>
                                  </span>
                                )}
                              </a>

                              {subitem.sub.length !== 0 && (
                                <ul className='navbar__submenu-items'>
                                  {subitem.sub.map(
                                    (nextitem) =>
                                      nextitem.title !== subitem.title && (
                                        <li>
                                          <a href={nextitem.url}>
                                            {nextitem.title}
                                          </a>
                                        </li>
                                      )
                                  )}
                                </ul>
                              )}
                            </li>
                          )
                      )}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <div className='navbar__icon' onClick={toggleSlideNav}>
              <FontAwesomeIcon icon={faBars} />
            </div>
            <div className='navbar__image'>
              <img src='/images/logo.png' alt='logo'></img>
            </div>
          </>
        )}
      </nav>
      <div
        className={`navbarSlide`}
        style={{ width: navWidth, padding: padding }}
      >
        <div
          className='navbar__icon'
          onClick={toggleSlideNav}
          style={{ opacity: iconOpacity }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </div>
        <ul className='navbarSlide__list' style={{ opacity: iconOpacity }}>
          {level > 1 && (
            <li onClick={() => GoBack()}>
              <FontAwesomeIcon icon={faArrowLeft} className='mr-sm' />
              Back
            </li>
          )}

          {visibleNavItems.map((item, i) => (
            <li key={i}>
              {item.sub.length === 0 ? (
                <a href={item.url}>{item.title}</a>
              ) : (
                <div onClick={() => GetNextNavItems(item.title)}>
                  {item.title}
                </div>
              )}
            </li>
          ))}
        </ul>
        <ul className='navbarSlide__info' style={{ opacity: iconOpacity }}>
          <li>(574) 674-5918</li>
          <li>58343 S Apple Rd, Osceola IN 46561</li>
          <li>info@osceolagrace.net</li>
        </ul>
      </div>
    </>
  )
}

export default Navbar
