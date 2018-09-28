import { createSelector } from 'reselect'

const membersState = (state) => state.get('members')

const membersSelector = () => createSelector(
  membersState,
  (state) => {
    const data = state.get('data')
    return data ? data.toJS() : data
  }
)

const loadingSelector = () => createSelector(
  membersState,
  (state) => {
    return state.get('loading')
  }
)

const errorSelector = () => createSelector(
  membersState,
  (state) => {
    const error = state.get('error')
    return error ? error.toJS() : error
  }
)

export {
  membersSelector,
  loadingSelector,
  errorSelector
}
