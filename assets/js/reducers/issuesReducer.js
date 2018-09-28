import { fromJS, List } from 'immutable'
import { API_GET_ISSUES } from '../actions/types'

const initialState = fromJS({
  data: new List([]),
  loading: false,
  success: false,
  error: null
})

export default function issuesReducer (state = initialState, action) {
  switch (action.type) {
    case API_GET_ISSUES.REQUEST:
    case API_GET_ISSUES.SUCCESS:
    case API_GET_ISSUES.FAILURE:
      return state.merge(action.payload)
    default:
      return state
  }
}
