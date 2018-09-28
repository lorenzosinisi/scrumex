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
import { CONFIGURATION } from '../config/index'

import {
  API_ATTACHMENT_UPLOAD
} from '../actions/types'

import {
  actionAttachmentUploads,
  actionWatchers
} from '../actions'

function * handleUploadAttachment(action) {
  try {
    const params = action.payload
    var data = new FormData()
    data.append('file', params.file)
    yield call(axios.post, `${CONFIGURATION.host}/api/projects/${params.project_id}/stories/${params.story_id}/upload`, data)
    const { data } = yield call(axios.get, `${CONFIGURATION.host}/api/projects/${params.project_id}/stories/${params.story_id}/attachments`)
    yield put(actionWatchers.watch(params))
    yield put(actionAttachmentUploads.success({ data }))
  } catch (e) {
    yield put(actionAttachmentUploads.failure({ error: { ...e } }))
  }
}

function * handleGetAttachments(action) {
  try {
    const params = action.payload
    const { data } = yield call(axios.get, `${CONFIGURATION.host}/api/projects/${params.project_id}/stories/${params.story_id}/attachments`)
    yield put(actionAttachmentUploads.success({ data }))
  } catch (e) {
    yield put(actionAttachmentUploads.failure({ error: { ...e } }))
  }
}

function * handleDeleteAttachment(action) {
  try {
    const params = action.payload
    yield call(axios.delete, `${CONFIGURATION.host}/api/projects/${params.project_id}/stories/${params.story_id}/attachments/${params.attachment_id}`)
    const { data } = yield call(axios.get, `${CONFIGURATION.host}/api/projects/${params.project_id}/stories/${params.story_id}/attachments`)
    yield put(actionAttachmentUploads.success({ data }))
  } catch (e) {
    yield put(actionAttachmentUploads.failure({ error: { ...e } }))
  }
}

function * watchAttachmentUploadSagas() {
  yield [
    takeLatest(API_ATTACHMENT_UPLOAD.CREATE, handleUploadAttachment),
    takeLatest(API_ATTACHMENT_UPLOAD.REQUEST, handleGetAttachments),
    takeLatest(API_ATTACHMENT_UPLOAD.DELETE, handleDeleteAttachment)
  ]
}

export default watchAttachmentUploadSagas
