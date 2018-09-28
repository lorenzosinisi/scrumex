import { fromJS, List } from 'immutable'
import { API_GET_MY_PROJECTS } from '../actions/types'

const initialState = fromJS({
  data: {
    mine: new List([]),
    collaborating: new List([])
  },
  loading: false,
  success: false,
  error: null
})

export default function exampleReducer (state = initialState, action) {
  switch (action.type) {
    case API_GET_MY_PROJECTS.REQUEST:
    case API_GET_MY_PROJECTS.SUCCESS:
    case API_GET_MY_PROJECTS.FAILURE:
      return state.merge(action.payload)
    default:
      return state
  }
}
