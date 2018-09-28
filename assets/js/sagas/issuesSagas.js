// In case you need to use a selector
// import also select from redux-saga/effects
// and then simplie yield select(yourSelector())
//
// In case you need to redirect to whatever route
// import { push } from react-router-redux and then
// yield put(push('/next-page'))
import 'babel-polyfill'
import 'babel-regenerator-runtime'
import { put, call, takeLatest } from 'redux-saga/lib/effects'
import axios from 'axios'
import { push } from 'react-router-redux'
import { CONFIGURATION } from '../config/index'

import {
  API_POST_ISSUE,
  API_GET_ISSUES,
  API_DELETE_ISSUE,
  API_SET_ISSUE_TO_SPRINT,
  API_GET_VOTING_ISSUE,
} from '../actions/types'

import {
  actionCreateIssue,
  actionGetIssues,
  actionDeleteIssue,
  actionSetIssueToSprint,
  actionGetVotingIssue,
  actionWatchers,
} from '../actions'

function * handleNewIssue (action) {
  try {
    const { data } = yield call(axios.post, `${CONFIGURATION.host}/api/projects/${action.payload.project_id}/issues/new`, { issue: action.payload })
    yield put(actionCreateIssue.success({ data }))
    yield put(actionWatchers.watch({ project_id: data.project_id, story_id: data.id }))
    yield put(push(`/app/projects/${data.project_id}/`))
  } catch (e) {
    yield put(actionCreateIssue.failure({ error: { ...e } }))
  }
}

function * handleGetIssues (action) {
  try {
    const { projectId } = action.payload
    const { data } = yield call(axios.get, `${CONFIGURATION.host}/api/projects/${projectId}/issues`)
    yield put(actionGetIssues.success({ data }))
  } catch (e) {
    yield put(actionGetIssues.failure({ error: { ...e } }))
  }
}

function * handleGetVotingIssue (action) {
  try {
    const { projectId, issueId } = action.payload
    const { data } = yield call(axios.get, `${CONFIGURATION.host}/api/projects/${projectId}/issues/${issueId}/vote`)
    yield put(actionGetVotingIssue.success({ data }))
  } catch (e) {
    yield put(actionGetVotingIssue.failure({ error: { ...e } }))
  }
}

function * handleDeleteIssue (action) {
  try {
    const { storyId, projectId } = action.payload
    const { data } = yield call(axios.delete, `${CONFIGURATION.host}/api/projects/${projectId}/issues/${storyId}/delete`)
    yield put(actionDeleteIssue.success({ data }))
    yield put(push(`/app/projects/${projectId}`))
  } catch (e) {
    yield put(actionDeleteIssue.failure({ error: { ...e } }))
  }
}

function * handleAddToSprint (action) {
  try {
    const { storyId, projectId, sprintId } = action.payload
    const { data } = yield call(axios.patch,
      `${CONFIGURATION.host}/api/projects/${projectId}/issues/${storyId}/add_to_sprint`, { sprint_id: sprintId })
    yield put(actionSetIssueToSprint.success({ data }))
  } catch (e) {
    yield put(actionSetIssueToSprint.failure({ error: { ...e } }))
  }
}

function * watchIssuesSagas () {
  yield [
    takeLatest(API_POST_ISSUE.SAVE, handleNewIssue),
    takeLatest(API_GET_ISSUES.REQUEST, handleGetIssues),
    takeLatest(API_DELETE_ISSUE.REQUEST, handleDeleteIssue),
    takeLatest(API_SET_ISSUE_TO_SPRINT.REQUEST, handleAddToSprint),
    takeLatest(API_GET_VOTING_ISSUE.REQUEST, handleGetVotingIssue)
  ]
}

export default watchIssuesSagas
