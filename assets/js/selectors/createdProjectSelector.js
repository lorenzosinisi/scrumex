import { createSelector } from 'reselect'

const createdProjectState = (state) => state.get('createdProject')

const createdProjectSelector = () => createSelector(
  createdProjectState,
  (state) => {
    const data = state.get('data')
    return data ? data.toJS() : data
  }
)

const createProjectLoadingSelector = () => createSelector(
  createdProjectState,
  (state) => {
    return state.get('loading')
  }
)

const createProjectErrorSelector = () => createSelector(
  createdProjectState,
  (state) => {
    const error = state.get('error')
    return error ? error.toJS() : error
  }
)
export {
  createdProjectSelector,
  createProjectLoadingSelector,
  createProjectErrorSelector
}
