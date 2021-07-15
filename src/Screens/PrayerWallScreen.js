import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faComment,
  faEnvelope,
  faPray,
  faShare,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { Dropdown } from 'reactjs-dropdown-component'
import Loader from '../Components/Loader'
import Toast from '../Components/Toast'
import Request from '../Components/Request'
import { createRequest, getRequests } from '../Actions/PrayerWallActions'
import { TransitionGroup } from 'react-transition-group'

const PrayerWallScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [share, setShare] = useState('')
  const [message, setMessage] = useState('')
  const [toasts, setToasts] = useState([])

  const list = [
    {
      label: 'Yes, share this on the prayer wall',
      value: 'yes',
    },
    {
      label: 'Please share this anonymously',
      value: 'anonymous',
    },
    {
      label: 'No, do not display this request',
      value: 'no',
    },
  ]

  const dispatch = useDispatch()

  const WallCreate = useSelector((state) => state.WallCreate)
  const {
    loading: loadingCreate,
    success: successCreate,
    request,
    error: errorCreate,
  } = WallCreate

  const WallGetRequests = useSelector((state) => state.WallGetRequests)
  var { loading: loadingGet, requests, error: errorGet } = WallGetRequests

  const WallAddPrayer = useSelector((state) => state.WallAddPrayer)
  var { error: errorAddPrayer } = WallAddPrayer

  const UsersName = useSelector((state) => state.UsersName)

  const WallAddReply = useSelector((state) => state.WallAddReply)
  var { error: errorAddReply } = WallAddReply

  // requests = {
  //   Items: [
  //     {
  //       share: 'yes',
  //       dateadded: '2021-06-06 12:11:37 am',
  //       prayedfor: 0,
  //       message: 'Praying for my mom',
  //       ID: '04db0ac1-43a2-4d2c-97f7-264f9da602f2',
  //       email: 'ksmith@gmail.com',
  //       name: 'Katie Smith',
  //       replies: [
  //         {
  //           text: 'This is a reply',
  //           name: 'Andrew Strycker',
  //           dateadded: '2021-06-06 :11:37 am',
  //         },
  //         {
  //           text: 'This is a reply but a second one',
  //           name: 'Martha',
  //           dateadded: '2021-06-21 12:11:37 am',
  //         },
  //       ],
  //     },
  //     {
  //       share: 'yes',
  //       dateadded: '2021-06-06 12:11:50 am',
  //       prayedfor: 5,
  //       message: 'Aj.',
  //       ID: '96e52fa9-2d50-4a16-ae7c-9ef3896c31fe',
  //       email: 'stryckerandrew@yahoo.com',
  //       name: 'AJ',
  //       replies: [],
  //     },
  //     {
  //       share: 'yes',
  //       dateadded: '2021-06-05 11:51:23 pm',
  //       prayedfor: 0,
  //       message: 'This goes on the wall. ',
  //       ID: '373a7280-8624-4aae-99ee-6b561d4a33a2',
  //       email: 'stryckerandrew@yahoo.com',
  //       name: 'AJ Strycker',
  //       replies: [],
  //     },
  //     {
  //       share: 'yes',
  //       dateadded: '2021-06-06 12:19:42 am',
  //       prayedfor: 0,
  //       message: 'Praying as my older son fights the demon of same-se',
  //       ID: '5c3393c5-5477-42d8-b982-54ee65b20ff4',
  //       email: 'marko@gmail.com',
  //       name: 'Marko',
  //       replies: [],
  //     },
  //     {
  //       share: 'yes',
  //       dateadded: '2021-06-06 12:24:11 am',
  //       prayedfor: 0,
  //       message:
  //         'Please pray for my daughter Wendy who is battling breast cancer and please pray for me I need gallbladder surgery and I need it to happen right away thank you so much',
  //       ID: 'ff5f0bef-d150-451e-999d-6e4bf9d3e553',
  //       email: 'stryckerandrew@yahoo.com',
  //       name: 'AJ',
  //       replies: [],
  //     },
  //   ],
  //   Count: 5,
  //   ScannedCount: 5,
  // }

  useEffect(() => {
    var desc = ''
    if (successCreate) {
      switch (share) {
        case 'no':
          desc =
            'Your prayer request has been sent and you will be emailed at the address you entered!'
          break
        case 'anonymous':
          desc =
            'You can see your request below, the name will show as anonymous.'
          requests.Items.unshift(request.body)
          break
        default:
          desc =
            'Prayer request successfully submitted and you can see it below!'
          requests.Items.unshift(request.body)
      }

      // show success message
      setToasts((toasts) => [
        ...toasts,
        {
          id: toasts.length + 1,
          title: 'Success',
          description: desc,
          type: 'success',
        },
      ])

      setTimeout(() => {
        if (document.getElementById(request.body.ID)) {
          window.scrollTo({
            behavior: 'smooth',
            top: document.getElementById(request.body.ID).offsetTop,
          })
        }
      }, 300)

      setName('')
      setEmail('')
      setShare('')
      setMessage('')
    }
  }, [dispatch, successCreate])

  // useEffect for the add prayer functionality
  useEffect(() => {
    // check if there is an error
    if (errorAddPrayer && Object.keys(errorAddPrayer).length > 0) {
      setToasts((toasts) => [
        ...toasts,
        {
          id: toasts.length + 1,
          title: 'Error',
          description:
            'There was an error adding a prayer to the request. If the problem persists please contact the sites administrator.',
          type: 'error',
        },
      ])
    }

    if (errorAddReply && Object.keys(errorAddReply).length > 0) {
      setToasts((toasts) => [
        ...toasts,
        {
          id: toasts.length + 1,
          title: 'Error',
          description:
            'There was an error adding your reply. If the problem persists please contact the sites administrator.',
          type: 'error',
        },
      ])
    }
  }, [dispatch])

  // use effect to just load the requests on page load
  useEffect(() => {
    dispatch(getRequests())
    setName(UsersName)
  }, [])

  // on change for the dropdown to choose which share
  const onChange = (item) => {
    setShare(item.value)
    if (item.value === 'anonymous') {
      setName('Anonymous')
    } else if (item.value !== 'anonymous' && name === 'Anonymous') {
      setName('')
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()

    if (share != '' && name != '' && email != '' && message != '') {
      // text areas put new lines so removing them here before calling API
      setMessage(message.replace(/(\r\n|\n|\r)/gm, ''))

      dispatch(
        createRequest({
          name,
          email,
          share,
          message,
        })
      )
    } else {
      // display message
      setToasts((toasts) => [
        ...toasts,
        {
          id: toasts.length + 1,
          title: 'Error',
          description: 'Please fill out all fields.',
          type: 'error',
        },
      ])
    }
  }

  return (
    <div className='prayerwall'>
      <div className='prayerwall__titlebox box'>
        <div className='prayerwall__prayicon'>
          <FontAwesomeIcon icon={faPray} />
        </div>
        <div className='prayerwall__titlebox-title title'>
          WELCOME TO THE PAYER WALL
        </div>
        <div className='prayerwall__titlebox-desc'>
          We offer this Prayer Wall as a way for us to continue to pray for each
          other and to know each others needs during this time. If you have a
          need, a request or a word of encouragement for others - please offer
          that here for all to see! If you would like to communicate to us
          privately about something in your life - you can choose the option
          below "No, do not display my request". Only the pastoral staff will be
          able to see the request and will respond.
        </div>
        <div className='prayerwall__titlebox-desc'>
          We will only pray that God works in whatever circumstances you share
          here. Leave your message and a name in the block below and click
          "Submit".
        </div>
        <div className='prayerwall__titlebox-desc'>
          This wall will periodically be cleared to allow for more posts but we
          will store and continue to pray for the outcome of your request.
        </div>
      </div>
      <form className='prayerwall__form box' onSubmit={submitHandler}>
        {loadingCreate ? (
          <Loader color={'white'} />
        ) : (
          <>
            <div className='form__group'>
              <div className='form__group-icon'>
                <FontAwesomeIcon icon={faUser} />
              </div>
              <input
                type='text'
                placeholder='Enter Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                spellCheck='false'
                required
              ></input>
            </div>
            <div className='form__group'>
              <div className='form__group-icon'>
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <input
                type='email'
                placeholder='Enter Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                spellCheck='false'
                required
              ></input>
            </div>
            <div className='form__group'>
              <div className='form__group-icon'>
                <FontAwesomeIcon icon={faShare} />
              </div>
              <div className='dropdown__full'>
                <Dropdown
                  name='choice'
                  title='Choose'
                  list={list}
                  onChange={onChange}
                  styles={{
                    wrapper: { width: '100%' },
                  }}
                />
              </div>
            </div>
            <div className='form__group'>
              <div className='form__group-icon'>
                <FontAwesomeIcon icon={faComment} />
              </div>
              <textarea
                type='text'
                placeholder='Your prayer request'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <input
              className='btn btn__outline form__group-btn'
              type='submit'
              value='Submit'
            />
          </>
        )}
      </form>

      <div className='prayerwall__wall'>
        <div className='prayerwall__wall__reqs'>
          {loadingGet ? (
            <Loader />
          ) : (
            <>
              {requests.Items ? (
                <TransitionGroup component='div'>
                  {requests.Items.sort((a, b) =>
                    Date.parse(a.dateadded) < Date.parse(b.dateadded) ? 1 : -1
                  ).map((req, i) => (
                    <Request req={req} i={i} />
                  ))}
                </TransitionGroup>
              ) : (
                'No prayer requests to display. '
              )}
            </>
          )}
        </div>
      </div>
      <Toast
        toastList={toasts}
        position='bottom-right'
        autoDelete={true}
        autoDeleteTime={10000}
      />
    </div>
  )
}

export default PrayerWallScreen
