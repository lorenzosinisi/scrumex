import { fromJS, Map } from 'immutable'
import { API_SPRINT } from '../actions/types'

const initialState = fromJS({
  data: new Map,
  loading: false,
  success: false,
  error: null
})

export default function reposReducer (state = initialState, action) {
  switch (action.type) {
    case API_SPRINT.RESET:
    return state.merge(initialState)
    case API_SPRINT.DONE:
    case API_SPRINT.REQUEST:
    case API_SPRINT.SUCCESS:
    case API_SPRINT.FAILURE:
      return state.merge(action.payload)
    default:
      return state
  }
}
