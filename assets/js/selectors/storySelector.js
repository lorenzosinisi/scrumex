import { createSelector } from 'reselect'

const storyState = (state) => state.get('story')

const storySelector = () => createSelector(
  storyState,
  (state) => {
    const data = state.get('data')
    return data ? data.toJS() : data
  }
)

const loadingSelector = () => createSelector(
  storyState,
  (state) => {
    return state.get('loading')
  }
)

const errorSelector = () => createSelector(
  storyState,
  (state) => {
    const error = state.get('error')
    return error ? error.toJS() : error
  }
)
export {
  storySelector,
  loadingSelector,
  errorSelector
}
