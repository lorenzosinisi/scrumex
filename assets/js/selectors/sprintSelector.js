import { createSelector } from 'reselect'

const sprintState = (state) => state.get('sprint')

const sprintSelector = () => createSelector(
  sprintState,
  (state) => {
    const data = state.get('data')
    return data ? data.toJS() : data
  }
)

const loadingSelector = () => createSelector(
  sprintState,
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
  sprintSelector,
  loadingSelector,
  errorSelector
}
