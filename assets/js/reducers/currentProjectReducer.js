import { fromJS, List } from 'immutable'
import { API_GET_PROJECT, API_PROJECT } from '../actions/types'

const initialState = fromJS({
  data: new List([]),
  loading: false,
  success: false,
  error: null
})

export default function currentProjectReducer (state = initialState, action) {
  switch (action.type) {
    case API_PROJECT.RESET:
      return state.merge(initialState)
    case API_PROJECT.SUCCESS:
    case API_PROJECT.FAILURE:
    case API_GET_PROJECT.REQUEST:
    case API_GET_PROJECT.SUCCESS:
    case API_GET_PROJECT.FAILURE:
      return state.merge(action.payload)
    default:
      return state
  }
}
