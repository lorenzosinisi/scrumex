import { createSelector } from 'reselect'

const attachmentsState = (state) => state.get('attachmentUploads')

const attachmentsSelector = () => createSelector(
  attachmentsState,
  (state) => {
    const data = state.get('data')
    return data ? data.toJS() : data
  }
)

export { attachmentsSelector }
