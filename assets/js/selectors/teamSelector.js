import { createSelector } from 'reselect'

const teamState = (state) => state.get('team')

const teamSelector = () => createSelector(
  teamState,
  (state) => {
    const data = state.get('data')
    return data ? data.toJS() : data
  }
)

const loadingSelector = () => createSelector(
  teamState,
  (state) => {
    return state.get('loading')
  }
)

const errorSelector = () => createSelector(
  teamState,
  (state) => {
    const error = state.get('error')
    return error ? error.toJS() : error
  }
)

export {
  teamSelector,
  loadingSelector,
  errorSelector
}
