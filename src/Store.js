import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
  wallAddPrayer,
  wallAddReply,
  wallCreateRequest,
  wallGetRequests,
  wallPrayedForIds,
  wallAddUsersName,
} from './Reducers/WallReducers'

const reducer = combineReducers({
  WallCreate: wallCreateRequest,
  WallGetRequests: wallGetRequests,
  WallAddPrayer: wallAddPrayer,
  WallAddReply: wallAddReply,
  WallPrayedForIds: wallPrayedForIds,
  UsersName: wallAddUsersName,
})

const prayedForIdsFromStorage = localStorage.getItem('prayedForIds')
  ? JSON.parse(localStorage.getItem('prayedForIds'))
  : []

const usersName = localStorage.getItem('usersName')
  ? localStorage.getItem('usersName')
  : ''

const initialState = {
  WallPrayedForIds: {
    prayedForIds: prayedForIdsFromStorage,
  },
  UsersName: usersName,
}

const middleware = [thunk]

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store
