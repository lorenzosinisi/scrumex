import { fromJS, List } from 'immutable'
import {
  API_COMMENTS
} from '../actions/types'

const initialState = fromJS({
  data: new List([]),
  loading: false,
  success: false,
  error: null
})

export default function commentsReducer(state = initialState, action) {
  switch (action.type) {
    case API_COMMENTS.RESET:
      return state.merge(initialState)
    case API_COMMENTS.REQUEST:
    case API_COMMENTS.SUCCESS:
    case API_COMMENTS.FAILURE:
      return state.merge(action.payload)
    default:
      return state
  }
}
