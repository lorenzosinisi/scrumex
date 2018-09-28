import { createSelector } from 'reselect'

const projectsState = (state) => state.get('projectsData')

const projectsSelector = () => createSelector(
  projectsState,
  (state) => {
    const data = state.get('data')
    return data ? data.toJS() : data
  }
)

const loadingSelector = () => createSelector(
  projectsState,
  (state) => {
    return state.get('loading')
  }
)

const errorSelector = () => createSelector(
  projectsState,
  (state) => {
    const error = state.get('error')
    return error ? error.toJS() : error
  }
)
export {
  projectsSelector,
  loadingSelector,
  errorSelector
}
