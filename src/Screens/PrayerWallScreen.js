import React, { useState, useEffect } from 'react'
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
import ReactPaginate from 'react-paginate'

const PrayerWallScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [share, setShare] = useState('')
  const [message, setMessage] = useState('')
  const [toasts, setToasts] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [PageCount, setPageCount] = useState(0)
  const [CurrentPageData, setCurrentPageData] = useState([])
  const [sort, setSort] = useState('new')
  const [search, setSearch] = useState('')
  const [searchData, setSearchData] = useState('')

  const RequestsPerPage = 10

  const listForShare = [
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

  const sortItems = [
    {
      label: 'Sort Newest to Oldest',
      value: 'new',
      selected: true,
    },
    {
      label: 'Sort Oldest to Newest',
      value: 'old',
      selected: false,
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
  var {
    loading: loadingGet,
    requests,
    success: successGetReq,
    error: errorGet,
  } = WallGetRequests

  const WallAddPrayer = useSelector((state) => state.WallAddPrayer)
  var { error: errorAddPrayer } = WallAddPrayer

  const UsersName = useSelector((state) => state.UsersName)

  const WallAddReply = useSelector((state) => state.WallAddReply)
  var { error: errorAddReply } = WallAddReply

  // update the page data after the get requests success
  useEffect(() => {
    updatePageData()
  }, [successGetReq, currentPage, sort])

  useEffect(() => {
    if (currentPage !== 0) {
      setCurrentPage(0)
    } else {
      updatePageData()
    }
  }, [searchData, requests])

  // everytime a new search
  useEffect(() => {
    if (search === '') {
      setSearchData([])
    } else {
      setSearchData(
        requests.Items.filter(
          (e) =>
            e.name.includes(search) ||
            e.dateadded.includes(search) ||
            e.message.includes(search)
        )
      )
    }
  }, [search])

  useEffect(() => {
    if (successCreate) {
      var desc = ''

      switch (share) {
        case 'no':
          desc =
            'Your prayer request has been sent and you will be emailed at the address you entered!'
          break
        case 'anonymous':
          desc =
            'You can see your request below, the name will show as anonymous.'
          requests.Items.unshift(request)
          CurrentPageData.unshift(request)
          break
        default:
          desc = 'Prayer request successfully submitted!'
          requests.Items.unshift(request)
          CurrentPageData.unshift(request)
          break
      }

      setSearch('')
      setSort('new')

      // show success message
      AddToast('success', desc)

      setTimeout(() => {
        if (document.getElementById(`req_${request.ID}`)) {
          window.scrollTo({
            behavior: 'smooth',
            top: document.getElementById(`req_${request.ID}`).offsetTop,
          })
        }
      }, 500)

      setName('')
      setEmail('')
      setShare('')
      setMessage('')
    }
  }, [dispatch, successCreate])

  // add a toast to the array
  const AddToast = (type, description) => {
    setToasts((toasts) => [
      ...toasts,
      {
        id: toasts.length + 1,
        title: type === 'error' ? 'Error' : 'Success',
        description,
        type,
      },
    ])
  }

  // show errors for the different actions
  useEffect(() => {
    if (errorAddPrayer && Object.keys(errorAddPrayer).length > 0) {
      AddToast('error', 'There was an error praying for this request.')
    }

    if (errorAddReply && Object.keys(errorAddReply).length > 0) {
      AddToast('error', 'There was an error adding your reply.')
    }

    if (errorGet && Object.keys(errorGet).length > 0) {
      AddToast('error', 'There was an error getting the prayer requests.')
    }

    if (errorCreate && Object.keys(errorCreate).length > 0) {
      AddToast('error', 'There was an error adding your request.')
    }
  }, [dispatch, errorGet, errorAddReply, errorAddPrayer, errorCreate])

  // use effect to just load the requests on page load
  useEffect(() => {
    dispatch(getRequests())
    setName(UsersName)
  }, [])

  // on change for the dropdown to choose which share
  const onShareChange = (item) => {
    setShare(item.value)
    if (item.value === 'anonymous') {
      setName('Anonymous')
    } else if (item.value !== 'anonymous' && name === 'Anonymous') {
      setName('')
    }
  }

  const onSortChange = (item) => {
    setSort(item.value)
    setCurrentPage(0)
  }

  const submitHandler = (e) => {
    e.preventDefault()

    if (share !== '' && name !== '' && email !== '' && message !== '') {
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

  const updatePageData = () => {
    if (requests && requests.Items) {
      var listToUse = search !== '' && searchData ? searchData : requests.Items

      setPageCount(Math.ceil(listToUse.length / RequestsPerPage))
      const offset = currentPage * RequestsPerPage

      if (sort === 'new') {
        setCurrentPageData(
          listToUse
            .sort((a, b) =>
              Date.parse(
                a.dateadded.replace(/-/g, '/').replace(/[T|Z]/g, ' ')
              ) <
              Date.parse(b.dateadded.replace(/-/g, '/').replace(/[T|Z]/g, ' '))
                ? 1
                : -1
            )
            .slice(offset, offset + RequestsPerPage)
        )
      } else {
        setCurrentPageData(
          listToUse
            .sort((a, b) =>
              Date.parse(
                a.dateadded.replace(/-/g, '/').replace(/[T|Z]/g, ' ')
              ) >
              Date.parse(b.dateadded.replace(/-/g, '/').replace(/[T|Z]/g, ' '))
                ? 1
                : -1
            )
            .slice(offset, offset + RequestsPerPage)
        )
      }
    }
  }

  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage)
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
                className='text-input'
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
                className='text-input'
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
                  list={listForShare}
                  onChange={onShareChange}
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
              <div className='prayerwall__wall__sort'>
                <input
                  className='input prayerwall__wall__sort-search'
                  placeholder='Search'
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Dropdown
                  name='sortChoice'
                  title='Sort'
                  list={sortItems}
                  onChange={onSortChange}
                />
              </div>
              {CurrentPageData && CurrentPageData.length > 0 ? (
                <>
                  {CurrentPageData.map((req, i) => (
                    <Request req={req} i={i} />
                  ))}
                </>
              ) : (
                <div className='prayerwall__wall__reqs-none'>
                  No prayer requests to display.
                </div>
              )}
            </>
          )}
        </div>
        {CurrentPageData && CurrentPageData.length > 0 && (
          <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            pageCount={PageCount}
            pageRangeDisplayed={2}
            marginPagesDisplayed={2}
            forcePage={currentPage}
            onPageChange={handlePageClick}
            containerClassName={'paginate'}
            activeClassName={'paginate__link--active'}
            disabledClassName={'paginate__link--disabled'}
          />
        )}
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
