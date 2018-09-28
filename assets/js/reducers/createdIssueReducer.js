import { fromJS, Map } from 'immutable'
import { API_POST_ISSUE } from '../actions/types'

const initialState = fromJS({
  data: new Map(),
  loading: false,
  success: false,
  error: null
})

export default function createdIssueReducer (state = initialState, action) {
  switch (action.type) {
    case API_POST_ISSUE.SAVE:
    case API_POST_ISSUE.SUCCESS:
    case API_POST_ISSUE.FAILURE:
      return state.merge(action.payload)
    default:
      return state
  }
}
