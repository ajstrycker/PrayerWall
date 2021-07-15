import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

const TopInfo = () => {
  return (
    <div className='topinfo'>
      <div className='topinfo__container'>
        <div className='topinfo__container-addr'>
          (574) 674-5918 • 58343 S Apple Rd, Osceola IN 46561 •
          info@osceolagrace.net
        </div>
        <div className='topinfo__container-social'>
          <a href='https://www.facebook.com/pages/Osceola-Grace/51244471852'>
            <div className='topinfo__container-box'>
              <FontAwesomeIcon icon={['fab', 'facebook-f']} />
            </div>
          </a>
          <a href='https://twitter.com/OsceolaGrace'>
            <div className='topinfo__container-box'>
              <FontAwesomeIcon icon={['fab', 'twitter']} />
            </div>
          </a>
          <a href='https://www.youtube.com/user/osceolagrace'>
            <div className='topinfo__container-box'>
              <FontAwesomeIcon icon={['fab', 'youtube']} />
            </div>
          </a>
          <a href='mailto:info@osceolagrace.net'>
            <div className='topinfo__container-box'>
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default TopInfo
