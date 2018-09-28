import { createSelector } from 'reselect'

const adminDashboardState = (state) => state.get('adminDashboard')

const adminDashboardSelector = () => createSelector(
  adminDashboardState,
  (state) => {
    const data = state.get('data')
    return data ? data.toJS() : data
  }
)

const loadingSelector = () => createSelector(
  adminDashboardState,
  (state) => {
    return state.get('loading')
  }
)

const errorSelector = () => createSelector(
  adminDashboardState,
  (state) => {
    const error = state.get('error')
    return error ? error.toJS() : error
  }
)
export {
  adminDashboardSelector,
  loadingSelector,
  errorSelector
}
