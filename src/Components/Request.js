import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentAlt, faPrayingHands } from '@fortawesome/free-solid-svg-icons'
import Reply from '../Components/Reply'
import { CSSTransition } from 'react-transition-group'
import { addPrayer } from '../Actions/PrayerWallActions'
import moment from 'moment'

const Request = ({ req, i }) => {
  const [prayedFor, setPrayedFor] = useState(0)
  const [replyCount, setReplyCount] = useState(0)
  const [replies, setReplies] = useState([])

  const itemRef = useRef()

  const dispatch = useDispatch()

  const WallPrayedForIds = useSelector((state) => state.WallPrayedForIds)
  const { prayedForIds } = WallPrayedForIds

  const WallAddPrayer = useSelector((state) => state.WallAddPrayer)
  var { loading: loadingAddPrayer, success: successAddPrayer } = WallAddPrayer

  useEffect(() => {
    setPrayedFor(req.prayedfor)
    setReplies(req.replies)
    setReplyCount(req.replies.length)
  }, [req])

  const AddPrayer = (id) => () => {
    return new Promise((resolve) => {
      // make sure they didnt alrady pray for this one
      if (prayedForIds.indexOf(id) == -1) {
        dispatch(addPrayer(id))

        setPrayedFor(prayedFor + 1)
      }
      resolve()
    })
  }

  const AddReplyToRequests = (replyToAdd) => {
    setReplies([...replies, replyToAdd])
    setReplyCount(replyCount + 1)
  }

  return (
    <>
      <CSSTransition timeout={400} classNames='collapse' key={i}>
        <div
          className='prayerwall__wall__reqs__req box'
          key={req.ID}
          id={req.ID}
        >
          <div className='prayerwall__wall__reqs__req-name'>
            {req.name}
            <div className='prayerwall__wall__reqs__req-date'>
              Requested - {moment(req.dateadded).format('MM/DD/YYYY')}
            </div>
          </div>
          <div className='prayerwall__wall__reqs__req-message'>
            {req.message}
          </div>
          <div className='prayerwall__wall__reqs__req-data'>
            <span className='data__icon'>
              <FontAwesomeIcon icon={faPrayingHands} />
            </span>
            <span className='data__num' id={`prayer_count_${req.ID}`}>
              {prayedFor ? prayedFor : 0}
            </span>
            <span className='data__icon'>
              <FontAwesomeIcon icon={faCommentAlt} />
            </span>
            <span className='data__num' id={`data_num_${req.ID}`}>
              {replyCount ? replyCount : 0}
            </span>
          </div>
          <hr className='prayerwall__wall__reqs__req-line' />
          <div className='prayerwall__wall__reqs__req-actions'>
            <div className='actions__box' onClick={AddPrayer(req.ID)}>
              <span
                className={`actions__box-icon ${
                  prayedForIds && prayedForIds.indexOf(req.ID) !== -1
                    ? 'color-primary'
                    : ''
                }`}
                id={`pray_icon_${req.ID}`}
              >
                <FontAwesomeIcon icon={faPrayingHands} />
              </span>
              {prayedForIds && prayedForIds.indexOf(req.ID) !== -1
                ? 'Thanks for praying!'
                : 'Pray'}
            </div>
            <div
              className='actions__box'
              onClick={() => {
                itemRef.current.expand()
              }}
            >
              <span className='actions__box-icon'>
                <FontAwesomeIcon icon={faCommentAlt} />
              </span>
              {replies && replyCount == 0 ? 'Reply' : 'Reply / View Replies'}
            </div>
          </div>
          <Reply
            id={req.ID}
            replies={replies}
            ref={(el) => (itemRef.current = el)}
            requestsSetter={AddReplyToRequests}
          />
        </div>
      </CSSTransition>
    </>
  )
}

export default Request
