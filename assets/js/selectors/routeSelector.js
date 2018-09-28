import { createSelector } from 'reselect'

const routeState = (state) => state.get('route')

const routeSelector = () => createSelector(
  routeState,
  (state) => {
    const data = state.get('location').get('pathname')
    return data
  }
)

export {
  routeSelector
}
