import { createSelector } from 'reselect'

const accountState = (state) => state.get('account')

const accountSelector = () => createSelector(
  accountState,
  (state) => {
    const data = state.get('data')
    return data ? data.toJS() : data
  }
)

const loadingSelector = () => createSelector(
  accountState,
  (state) => {
    return state.get('loading')
  }
)

const errorSelector = () => createSelector(
  accountState,
  (state) => {
    const error = state.get('error')
    return error ? error.toJS() : error
  }
)
export {
  accountSelector,
  loadingSelector,
  errorSelector
}
