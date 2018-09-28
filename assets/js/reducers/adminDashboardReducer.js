import { fromJS, Map } from 'immutable'
import { API_ADMIN_DASHBOARD } from '../actions/types'

const initialState = fromJS({
  data: new Map({users: [], projects: [], stories: []}),
  loading: false,
  success: false,
  error: null
})

export default function adminDashboardReducer (state = initialState, action) {
  switch (action.type) {
    case API_ADMIN_DASHBOARD.REQUEST:
    case API_ADMIN_DASHBOARD.SUCCESS:
    case API_ADMIN_DASHBOARD.FAILURE:
      return state.merge(action.payload)
    default:
      return state
  }
}
