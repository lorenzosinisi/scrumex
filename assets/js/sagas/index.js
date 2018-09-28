import { fork } from 'redux-saga/lib/effects'
import watchProjectsSagas from './projectsSagas'
import watchProjectSagas from './currentProjectSagas'
import watchReposSagas from './reposSagas'
import watchCreateProjectSagas from './createProjectSagas'
import watchSprintsSagas from './sprintsSagas'
import watchIssuesSagas from './issuesSagas'
import watchEntriesSagas from './entriesSagas'
import watchStorySagas from './storySagas'
import watchTeamSagas from './teamSagas'
import watchUserSagas from './userSagas'
import watchCommentsSagas from './commentSagas'
import watchWatchersSagas from './watchersSagas'
import watchAttachmentUploadSagas from './attachmentUploadSagas'
import watchSearchStoriesSagas from './searchStoriesSagas'
import watchMemebersSagas from './membersSagas'
import watchAccountSagas from './accountSagas'
import watchFeedbackSagas from './feedbackSagas'
import watchAdminDashboardSagas from './adminDashboardSagas'

export default function * rootSaga () {
  yield [
    fork(watchProjectsSagas),
    fork(watchProjectSagas),
    fork(watchReposSagas),
    fork(watchCreateProjectSagas),
    fork(watchSprintsSagas),
    fork(watchIssuesSagas),
    fork(watchEntriesSagas),
    fork(watchStorySagas),
    fork(watchTeamSagas),
    fork(watchUserSagas),
    fork(watchCommentsSagas),
    fork(watchWatchersSagas),
    fork(watchAttachmentUploadSagas),
    fork(watchSearchStoriesSagas),
    fork(watchMemebersSagas),
    fork(watchAccountSagas),
    fork(watchFeedbackSagas),
    fork(watchAdminDashboardSagas)
  ]
}
