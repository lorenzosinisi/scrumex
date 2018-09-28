import { fromJS, Map } from 'immutable'
import {
  API_MEMBERS
} from '../actions/types'

const initialState = fromJS({
  data: new Map({users: [], invitations: []}),
  loading: false,
  success: false,
  error: null
})

export default function membersReducer(state = initialState, action) {
  switch (action.type) {
    case API_MEMBERS.RESET:
      return state.merge(initialState)
    case API_MEMBERS.REQUEST:
    case API_MEMBERS.SUCCESS:
    case API_MEMBERS.FAILURE:
      return state.merge(action.payload)
    default:
      return state
  }
}
