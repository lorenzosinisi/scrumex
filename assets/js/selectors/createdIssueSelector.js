import { createSelector } from 'reselect'

const createdIssueState = (state) => state.get('createdIssue')

const issueSelector = () => createSelector(
  createdIssueState,
  (state) => {
    const data = state.get('data')
    return data ? data.toJS() : data
  }
)

const loadingSelector = () => createSelector(
  createdIssueState,
  (state) => {
    return state.get('loading')
  }
)

const errorSelector = () => createSelector(
  createdIssueState,
  (state) => {
    const error = state.get('error')
    return error ? error.toJS() : error
  }
)
export {
  issueSelector,
  loadingSelector,
  errorSelector
}
