import { fromJS, List } from 'immutable'
import { API_FEEDBACK } from '../actions/types'

const initialState = fromJS({
  data: new List(),
  loading: false,
  success: false,
  error: null
})

export default function feedbackReducer (state = initialState, action) {
  switch (action.type) {
    case API_FEEDBACK.REQUEST:
    case API_FEEDBACK.SUCCESS:
    case API_FEEDBACK.FAILURE:
      return state.merge(action.payload)
    default:
      return state
  }
}
