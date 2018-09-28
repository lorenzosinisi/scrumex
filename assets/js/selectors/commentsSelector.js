import { createSelector } from 'reselect'

const commentsState = (state) => state.get('comments')

const commentsSelector = () => createSelector(
  commentsState,
  (state) => {
    const data = state.get('data')
    return data ? data.toJS() : data
  }
)

const loadingSelector = () => createSelector(
  commentsState,
  (state) => {
    return state.get('loading')
  }
)

const errorSelector = () => createSelector(
  commentsState,
  (state) => {
    const error = state.get('error')
    return error ? error.toJS() : error
  }
)
export {
  commentsSelector,
  loadingSelector,
  errorSelector
}
