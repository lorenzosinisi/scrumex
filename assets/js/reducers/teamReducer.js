import { fromJS, Map } from 'immutable'
import {
  API_TEAM
} from '../actions/types'

const initialState = fromJS({
  data: new Map(),
  loading: false,
  success: false,
  error: null
})

export default function teamReducer (state = initialState, action) {
  switch (action.type) {
    case API_TEAM.RESET:
     return state.merge(initialState)
    case API_TEAM.REQUEST:
    case API_TEAM.SUCCESS:
    case API_TEAM.FAILURE:
      return state.merge(action.payload)
    default:
      return state
  }
}
