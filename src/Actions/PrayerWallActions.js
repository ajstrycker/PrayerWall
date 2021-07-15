import axios from 'axios'

import {
  WALL_CREATE_FAIL,
  WALL_CREATE_REQUEST,
  WALL_CREATE_SUCCESS,
  WALL_GET_FAIL,
  WALL_GET_SUCCESS,
  WALL_GET_REQUEST,
  WALL_ADD_PRAYER_FAIL,
  WALL_ADD_PRAYER_SUCCESS,
  WALL_ADD_PRAYER_REQUEST,
  WALL_ADD_REPLY_FAIL,
  WALL_ADD_REPLY_SUCCESS,
  WALL_ADD_REPLY_REQUEST,
  WALL_ADD_ID_TO_LIST,
  WALL_ADD_USERS_NAME,
} from '../Constants/PrayerWallConstants'

export const createRequest = (request) => async (dispatch, getState) => {
  try {
    dispatch({
      type: WALL_CREATE_REQUEST,
    })

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.REACT_APP_API_KEY,
      },
    }

    const { data } = await axios.post(
      `https://wrf0d8ve8j.execute-api.us-east-2.amazonaws.com/${process.env.REACT_APP_ENVIRONMENT}/prayer-wall`,
      request,
      config
    )

    if (request.name !== 'Anonymous') {
      localStorage.setItem('usersName', request.name)
      dispatch({ type: WALL_ADD_USERS_NAME, payload: request.name })
    }

    dispatch({
      type: WALL_CREATE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: WALL_CREATE_FAIL,
      payload: error,
    })
  }
}

export const getRequests = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: WALL_GET_REQUEST,
    })

    const { data } = await axios.get(
      `https://wrf0d8ve8j.execute-api.us-east-2.amazonaws.com/${process.env.REACT_APP_ENVIRONMENT}/prayer-wall`
    )

    dispatch({
      type: WALL_GET_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: WALL_GET_FAIL,
      payload: error,
    })
  }
}

export const addPrayer = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: WALL_ADD_PRAYER_REQUEST,
    })

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.REACT_APP_API_KEY,
      },
    }

    const { data } = await axios.put(
      `https://wrf0d8ve8j.execute-api.us-east-2.amazonaws.com/${process.env.REACT_APP_ENVIRONMENT}/prayer-wall/${id}`,
      {},
      config
    )

    var idList = localStorage.getItem('prayedForIds')
      ? JSON.parse(localStorage.getItem('prayedForIds'))
      : []

    if (idList.indexOf(id) == -1) {
      idList.push(id)

      localStorage.setItem('prayedForIds', JSON.stringify(idList))

      dispatch({ type: WALL_ADD_ID_TO_LIST, payload: idList })
    }

    dispatch({
      type: WALL_ADD_PRAYER_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: WALL_ADD_PRAYER_FAIL,
      payload: error,
    })
  }
}

export const addReply = (id, reply) => async (dispatch) => {
  try {
    dispatch({
      type: WALL_ADD_REPLY_REQUEST,
    })

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.REACT_APP_API_KEY,
      },
    }

    const { data } = await axios.post(
      `https://wrf0d8ve8j.execute-api.us-east-2.amazonaws.com/${process.env.REACT_APP_ENVIRONMENT}/prayer-wall/${id}`,
      reply,
      config
    )

    if (reply.name !== 'Anonymous') {
      localStorage.setItem('usersName', reply.name)
      dispatch({ type: WALL_ADD_USERS_NAME, payload: reply.name })
    }

    dispatch({
      type: WALL_ADD_REPLY_SUCCESS,
      payload: data,
      id: id,
    })
  } catch (error) {
    dispatch({
      type: WALL_ADD_REPLY_FAIL,
      payload: error,
    })
  }
}
