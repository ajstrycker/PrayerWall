import {
  WALL_CREATE_FAIL,
  WALL_CREATE_SUCCESS,
  WALL_CREATE_REQUEST,
  WALL_GET_FAIL,
  WALL_GET_SUCCESS,
  WALL_GET_REQUEST,
  WALL_ADD_PRAYER_REQUEST,
  WALL_ADD_PRAYER_SUCCESS,
  WALL_ADD_PRAYER_FAIL,
  WALL_ADD_REPLY_REQUEST,
  WALL_ADD_REPLY_SUCCESS,
  WALL_ADD_REPLY_FAIL,
  WALL_ADD_ID_TO_LIST,
  WALL_ADD_USERS_NAME,
} from '../Constants/PrayerWallConstants'

export const wallCreateRequest = (state = {}, action) => {
  switch (action.type) {
    case WALL_CREATE_REQUEST:
      return {
        loading: true,
      }
    case WALL_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        request: action.payload,
      }
    case WALL_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}

export const wallGetRequests = (state = { requests: {} }, action) => {
  switch (action.type) {
    case WALL_GET_REQUEST:
      return {
        loading: true,
      }
    case WALL_GET_SUCCESS:
      return {
        loading: false,
        requests: action.payload,
        success: true,
      }
    case WALL_GET_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}

export const wallAddPrayer = (state = { error: {} }, action) => {
  switch (action.type) {
    case WALL_ADD_PRAYER_REQUEST:
      return {
        loading: true,
      }
    case WALL_ADD_PRAYER_SUCCESS:
      return {
        loading: false,
        success: true,
      }
    case WALL_ADD_PRAYER_FAIL:
      return {
        loading: false,
        success: false,
        error: action.payload,
      }
    default:
      return state
  }
}

export const wallAddReply = (state = { error: {} }, action) => {
  switch (action.type) {
    case WALL_ADD_REPLY_REQUEST:
      return {
        loading: true,
      }
    case WALL_ADD_REPLY_SUCCESS:
      return {
        loading: false,
        success: true,
        id: action.id,
      }
    case WALL_ADD_REPLY_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}

export const wallPrayedForIds = (state = {}, action) => {
  switch (action.type) {
    case WALL_ADD_ID_TO_LIST:
      return {
        prayedForIds: action.payload,
      }
    default:
      return state
  }
}

export const wallAddUsersName = (state = null, action) => {
  switch (action.type) {
    case WALL_ADD_USERS_NAME:
      return action.payload
    default:
      return state
  }
}
