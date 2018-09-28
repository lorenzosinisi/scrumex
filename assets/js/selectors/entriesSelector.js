import { createSelector } from 'reselect'

const entriesState = (state) => state.get('entries')

const entriesSelector = () => createSelector(
  entriesState,
  (state) => {
    const data = state.get('data')
    return data ? data.toJS() : data
  }
)

const loadingSelector = () => createSelector(
  entriesState,
  (state) => {
    return state.get('loading')
  }
)

const errorSelector = () => createSelector(
  entriesState,
  (state) => {
    const error = state.get('error')
    return error ? error.toJS() : error
  }
)

export {
  entriesSelector,
  loadingSelector,
  errorSelector
}
