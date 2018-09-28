import { createSelector } from 'reselect'

const watchersState = (state) => state.get('watchers')

const watchersSelector = () => createSelector(
  watchersState,
  (state) => {
    const data = state.get('data')
    return data ? data.toJS() : data
  }
)

const loadingSelector = () => createSelector(
  watchersState,
  (state) => {
    return state.get('loading')
  }
)

const errorSelector = () => createSelector(
  sprintState,
  (state) => {
    const error = state.get('error')
    return error ? error.toJS() : error
  }
)
export {
  watchersSelector,
  loadingSelector,
  errorSelector
}
