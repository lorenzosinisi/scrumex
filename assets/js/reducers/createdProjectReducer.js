import { fromJS, Map } from 'immutable'
import {
  API_POST_PROJECT,
  API_PROJECT
} from '../actions/types'

const initialState = fromJS({
  data: new Map(),
  loading: false,
  success: false,
  error: null
})

export default function createdProjectReducer (state = initialState, action) {
  switch (action.type) {
    case API_POST_PROJECT.SAVE:
    case API_POST_PROJECT.SUCCESS:
    case API_POST_PROJECT.FAILURE:
      return state.merge(action.payload)
    default:
      return state
  }
}
