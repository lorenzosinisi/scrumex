import { createSelector } from 'reselect'

const burndownchartState = (state) => state.get('burndownchart')

const burndownchartSelector = () => createSelector(
  burndownchartState,
  (state) => {
    const data = state.get('data')
    return data ? data.toJS() : data
  }
)

const loadingSelector = () => createSelector(
  burndownchartState,
  (state) => {
    return state.get('loading')
  }
)

const errorSelector = () => createSelector(
  burndownchartState,
  (state) => {
    const error = state.get('error')
    return error ? error.toJS() : error
  }
)

export {
  burndownchartSelector,
  loadingSelector,
  errorSelector
}
