import { createSelector } from 'reselect'

const searchStoriesState = (state) => state.get('searchStories')

const searchStoriesSelector = () => createSelector(
  searchStoriesState,
  (state) => {
    const data = state.get('data')
    return data ? data.toJS() : data
  }
)

const loadingSelector = () => createSelector(
  searchStoriesState,
  (state) => {
    return state.get('loading')
  }
)

const errorSelector = () => createSelector(
  searchStoriesState,
  (state) => {
    const error = state.get('error')
    return error ? error.toJS() : error
  }
)

export {
  searchStoriesSelector,
  loadingSelector,
  errorSelector
}
