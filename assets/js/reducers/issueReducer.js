import { fromJS, Map } from 'immutable'
import {
  API_RESET_VOTING_ISSUE,
  API_GET_VOTING_ISSUE
} from '../actions/types'

const initialState = fromJS({
  data: new Map(),
  loading: false,
  success: false,
  error: null
})

export default function issueReducer (state = initialState, action) {
  switch (action.type) {
    case API_RESET_VOTING_ISSUE:
      return state.merge(initialState)
    case API_GET_VOTING_ISSUE.SAVE:
    case API_GET_VOTING_ISSUE.SUCCESS:
    case API_GET_VOTING_ISSUE.FAILURE:
      return state.merge(action.payload)
    default:
      return state
  }
}
