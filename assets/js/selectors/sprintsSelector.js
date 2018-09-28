import { createSelector } from 'reselect'

const sprintsState = (state) => state.get('sprints')

const sprintsSelector = () => createSelector(
  sprintsState,
  (state) => {
    const data = state.get('data')
    return data ? data.toJS() : data
  }
)

const loadingSelector = () => createSelector(
  sprintsState,
  (state) => {
    return state.get('loading')
  }
)

const errorSelector = () => createSelector(
  sprintsState,
  (state) => {
    const error = state.get('error')
    return error ? error.toJS() : error
  }
)
export {
  sprintsSelector,
  loadingSelector,
  errorSelector
}
