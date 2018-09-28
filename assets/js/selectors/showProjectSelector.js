import { createSelector } from 'reselect'

const currentProjectState = (state) => state.get('currentProject')

const currentProjectSelector = () => createSelector(
  currentProjectState,
  (state) => {
    const data = state.get('data')
    return data ? data.toJS() : data
  }
)

const loadingSelector = () => createSelector(
  currentProjectState,
  (state) => {
    return state.get('loading')
  }
)

const errorSelector = () => createSelector(
  currentProjectState,
  (state) => {
    const error = state.get('error')
    return error ? error.toJS() : error
  }
)
export {
  currentProjectSelector,
  loadingSelector,
  errorSelector
}
