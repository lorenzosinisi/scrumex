import { fromJS, Map } from 'immutable'
import { API_ACCOUNT } from '../actions/types'

const initialState = fromJS({
  data: new Map(),
  loading: false,
  success: false,
  error: null
})

export default function accountReducer (state = initialState, action) {
  switch (action.type) {
    case API_ACCOUNT.SAVE:
    case API_ACCOUNT.SUCCESS:
    case API_ACCOUNT.FAILURE:
      return state.merge(action.payload)
    default:
      return state
  }
}
