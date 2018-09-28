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
  API_COMMENTS
} from '../actions/types'

import {
  actionComments,
  actionWatchers
} from '../actions'

function * handleGetComments(action) {
  try {
    const params = action.payload
    const { data } = yield call(axios.get, `${CONFIGURATION.host}/api/projects/${params.project_id}/stories/${params.story_id}/comments`)
    yield put(actionComments.success({ data }))
  } catch (e) {
    yield put(actionComments.failure({ error: { ...e } }))
  }
}

function* handleCreateComment(action) {
  try {
    const params = action.payload
    yield call(axios.post, `${CONFIGURATION.host}/api/projects/${params.project_id}/stories/${params.story_id}/comments`, { body: params.body, parent_id: params.comment_parent_id})
    const { data } = yield call(axios.get, `${CONFIGURATION.host}/api/projects/${params.project_id}/stories/${params.story_id}/comments`)
    yield put(actionWatchers.watch(params))
    yield put(actionComments.success({ data }))
  } catch (e) {
    yield put(actionComments.failure({ error: { ...e } }))
  }
}

function * handleDeleteComment(action) {
  try {
    const params = action.payload
    yield call(axios.delete, `${CONFIGURATION.host}/api/projects/${params.project_id}/stories/${params.story_id}/comments/${params.comment_id}`)
    const { data } = yield call(axios.get, `${CONFIGURATION.host}/api/projects/${params.project_id}/stories/${params.story_id}/comments`)
    yield put(actionComments.success({ data }))
  } catch (e) {
    yield put(actionComments.failure({ error: { ...e } }))
  }
}

function* watchCommentsSagas() {
  yield [
    takeLatest(API_COMMENTS.REQUEST, handleGetComments),
    takeLatest(API_COMMENTS.DELETE, handleDeleteComment),
    takeLatest(API_COMMENTS.CREATE, handleCreateComment)
  ]
}

export default watchCommentsSagas
