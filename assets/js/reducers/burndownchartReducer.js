import { fromJS, Map } from 'immutable'
import { API_SPRINT, API_BURNDOWNCHART } from '../actions/types'

const initialState = fromJS({
  data: new Map,
  loading: false,
  success: false,
  error: null
})

export default function burndownchartReducer (state = initialState, action) {
  switch (action.type) {
    case API_SPRINT.RESET:
    case API_BURNDOWNCHART.RESET:
    return state.merge(initialState)
    case API_BURNDOWNCHART.SUCCESS:
    case API_BURNDOWNCHART.FAILURE:
      return state.merge(action.payload)
    default:
      return state
  }
}
