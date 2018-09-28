import { createSelector } from 'reselect'

const issuesState = (state) => state.get('issues')

const issuesSelector = () => createSelector(
  issuesState,
  (state) => {
    const data = state.get('data')
    return data ? data.toJS() : data
  }
)

const loadingSelector = () => createSelector(
  issuesState,
  (state) => {
    return state.get('loading')
  }
)

const errorSelector = () => createSelector(
  issuesState,
  (state) => {
    const error = state.get('error')
    return error ? error.toJS() : error
  }
)
export {
  issuesSelector,
  loadingSelector,
  errorSelector
}
