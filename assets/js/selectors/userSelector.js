import { createSelector } from 'reselect'

const userState = (state) => state.get('user')

const userSelector = () =>
  createSelector(userState, state => {
    const data = state.get("data")
    return data ? data.toJS() : data
  });
export {
  userSelector
}
