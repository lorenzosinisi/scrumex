import { fromJS, Map } from 'immutable'
import {
  API_GET_ENTRIES,
  RESET_ENTRIES
} from '../actions/types'

const initialState = fromJS({
  data: new Map(),
  loading: false,
  success: false,
  error: null
})

export default function entriesReducer (state = initialState, action) {
  switch (action.type) {
    case RESET_ENTRIES:
      return state.merge(initialState)
    case API_GET_ENTRIES.SAVE:
    case API_GET_ENTRIES.SUCCESS:
    case API_GET_ENTRIES.FAILURE:
      return state.merge(action.payload)
    default:
      return state
  }
}
