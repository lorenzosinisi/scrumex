import { fromJS, List } from 'immutable'
import {
  API_GET_SPRINTS,
  API_RESET_SPRINTS
} from '../actions/types'

const initialState = fromJS({
  data: new List([]),
  loading: false,
  success: false,
  error: null
})

export default function sprintsReducer (state = initialState, action) {
  switch (action.type) {
    case API_RESET_SPRINTS:
      return state.merge(initialState)
    case API_GET_SPRINTS.REQUEST:
    case API_GET_SPRINTS.SUCCESS:
    case API_GET_SPRINTS.FAILURE:
      return state.merge(action.payload)
    default:
      return state
  }
}
