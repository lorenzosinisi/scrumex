import { createSelector } from 'reselect'

const reposState = (state) => state.get('repos')

const reposSelector = () => createSelector(
  reposState,
  (state) => {
    const data = state.get('data')
    return data ? data.toJS() : data
  }
)

const loadingSelector = () => createSelector(
  reposState,
  (state) => {
    return state.get('loading')
  }
)

const errorSelector = () => createSelector(
  reposState,
  (state) => {
    const error = state.get('error')
    return error ? error.toJS() : error
  }
)
export {
  reposSelector,
  loadingSelector,
  errorSelector
}
