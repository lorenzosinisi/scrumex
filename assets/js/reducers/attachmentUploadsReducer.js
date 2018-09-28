import { fromJS, List } from 'immutable'
import {
  API_ATTACHMENT_UPLOAD
} from '../actions/types'

const initialState = fromJS({
  data: new List([]),
  loading: false,
  success: false,
  error: null
})

export default function commentsReducer(state = initialState, action) {
  switch (action.type) {
    case API_ATTACHMENT_UPLOAD.REQUEST:
    case API_ATTACHMENT_UPLOAD.SUCCESS:
    case API_ATTACHMENT_UPLOAD.FAILURE:
      return state.merge(action.payload)
    default:
      return state
  }
}
