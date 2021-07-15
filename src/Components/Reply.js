import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { addReply } from '../Actions/PrayerWallActions'
import Loader from '../Components/Loader'
import moment from 'moment'

const Reply = forwardRef(({ id, replies, requestsSetter }, ref) => {
  const [expanded, setExpanded] = useState(false)
  const [replyName, setReplyName] = useState('')
  const [replyText, setReplyText] = useState('')
  const [replyError, setReplyError] = useState('')

  const dispatch = useDispatch()

  const WallAddReply = useSelector((state) => state.WallAddReply)
  var { loading, success, id: idOfReplyAdded } = WallAddReply

  const UsersName = useSelector((state) => state.UsersName)

  const expand = () => {
    setExpanded(!expanded)
  }

  useImperativeHandle(ref, () => {
    return {
      expand: expand,
    }
  })

  useEffect(() => {
    if (success && idOfReplyAdded === id) {
      var reply = {
        name: replyName,
        text: replyText,
        dateadded: new Date(),
      }

      requestsSetter(reply)

      setReplyText('')
    }
  }, [dispatch, success])

  // use effect to just load the requests on page load
  useEffect(() => {
    setReplyName(UsersName)
  }, [])

  const submitHandler = (e) => {
    e.preventDefault()

    if (replyName.trim() === '' || replyText.trim() === '') {
      setReplyError(
        'Please fill out both a reply and your name to add a reply.'
      )
    } else {
      setReplyError('')

      const reply = {
        name: replyName,
        text: replyText,
      }
      //send the request
      dispatch(addReply(id, reply))
    }
  }

  return (
    <CSSTransition
      in={expanded}
      timeout={400}
      classNames='collapse'
      className='replies'
      unmountOnExit
      onExit={() => setReplyError('')}
    >
      <div>
        <hr className='prayerwall__wall__reqs__req-line mb-md' />
        {replyError && <div className='replies__error'>{replyError}</div>}
        {loading ? (
          <Loader />
        ) : (
          <form className='form__group replies__input' onSubmit={submitHandler}>
            <input
              type='text'
              className='replies__input-reply'
              placeholder='Write a reply...'
              onChange={(e) => setReplyText(e.target.value)}
              value={replyText}
            />
            <input
              type='text'
              className='replies__input-name'
              placeholder='Your name'
              onChange={(e) => setReplyName(e.target.value)}
              value={replyName}
            />
            <button
              className='btn btn__outline-green replies__input-button ml-sm'
              type='submit'
            >
              Reply
            </button>
          </form>
        )}

        <div className='replies__all'>
          <TransitionGroup component='div'>
            {replies &&
              replies.map((reply, i) => (
                <CSSTransition timeout={400} classNames='collapse' key={i}>
                  <div className='replies__all__reply'>
                    <div className='replies__all__reply-namedate'>
                      <div className='replies__all__reply-name'>
                        {reply.name}
                      </div>
                      <div className='replies__all__reply-date'>
                        {moment(reply.dateadded).format('MM/DD/YYYY')}
                      </div>
                    </div>

                    <div className='replies__all__reply-text'>{reply.text}</div>
                  </div>
                </CSSTransition>
              ))}
          </TransitionGroup>
        </div>
      </div>
    </CSSTransition>
  )
})

export default Reply
