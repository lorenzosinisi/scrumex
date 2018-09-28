import { fromJS, List } from 'immutable'
import { API_WATCHERS } from '../actions/types'

const initialState = fromJS({
  data: new List([]),
  loading: false,
  success: false,
  error: null
})

export default function watchersReducer(state = initialState, action) {
  switch (action.type) {
    case API_WATCHERS.RESET:
      return state.merge(initialState)
    case API_WATCHERS.SUCCESS:
    case API_WATCHERS.FAILURE:
    case API_WATCHERS.REQUEST:
      return state.merge(action.payload)
    default:
      return state
  }
}
