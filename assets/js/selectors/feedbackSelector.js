import { createSelector } from 'reselect'

const feedbackState = (state) => state.get('feedback')

const feedbackSelector = () => createSelector(
  feedbackState,
  (state) => {
    const data = state.get('data')
    return data ? data.toJS() : data
  }
)

const loadingSelector = () => createSelector(
  feedbackState,
  (state) => {
    return state.get('loading')
  }
)

const errorSelector = () => createSelector(
  feedbackState,
  (state) => {
    const error = state.get('error')
    return error ? error.toJS() : error
  }
)

export {
  feedbackSelector,
  loadingSelector,
  errorSelector
}
