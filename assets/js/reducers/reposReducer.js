import { fromJS, List } from 'immutable'
import { API_GET_REPOS } from '../actions/types'

const initialState = fromJS({
  data: new List([]),
  loading: false,
  success: false,
  error: null
})

export default function reposReducer (state = initialState, action) {
  switch (action.type) {
    case API_GET_REPOS.REQUEST:
    case API_GET_REPOS.SUCCESS:
    case API_GET_REPOS.FAILURE:
      return state.merge(action.payload)
    default:
      return state
  }
}
