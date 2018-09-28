import { fromJS } from 'immutable'
import { API_SEARCH_STORIES } from '../actions/types'

const initialState = fromJS({
  data: [],
  loading: false,
  success: false,
  error: null
})

export default function searchStoriesReducer (state = initialState, action) {
  switch (action.type) {
    case API_SEARCH_STORIES.RESET:
    return state.merge(initialState)
    case API_SEARCH_STORIES.SUCCESS:
    case API_SEARCH_STORIES.FAILURE:
      return state.merge(action.payload)
    default:
      return state
  }
}
