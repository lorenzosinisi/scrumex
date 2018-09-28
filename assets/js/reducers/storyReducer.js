import { fromJS, Map } from 'immutable'
import {
  API_STORY,
  API_RESET_STORY
} from '../actions/types'

const initialState = fromJS({
  data: new Map(),
  loading: false,
  success: false,
  error: null
})

export default function storyReducer (state = initialState, action) {
  switch (action.type) {
    case API_RESET_STORY:
    return state.merge(initialState)
    case API_STORY.UPDATE:
    case API_STORY.ASSIGN_TO_ME:
    case API_STORY.REQUEST:
    case API_STORY.DONE:
    case API_STORY.SUCCESS:
    case API_STORY.FAILURE:
      return state.merge(action.payload)
    default:
      return state
  }
}
