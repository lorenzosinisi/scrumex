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
  API_MEMBERS
} from '../actions/types'

import {
  actionMembers
} from '../actions'

function * handleGetMembers(action) {
  try {
    const params = action.payload
    const { data } = yield call(axios.get, `${CONFIGURATION.host}/api/projects/${params.projectId}/members`)
    yield put(actionMembers.success({ data }))
  } catch (e) {
    yield put(actionMembers.failure({ error: { ...e } }))
  }
}

function * handleCreateMember(action) {
  try {
    const params = action.payload
    yield call(axios.post, `${CONFIGURATION.host}/api/projects/${params.projectId}/add_member/${params.email}`)
    const { data } = yield call(axios.get, `${CONFIGURATION.host}/api/projects/${params.projectId}/members`)
    yield put(actionMembers.success({ data }))
  } catch (e) {
    yield put(actionMembers.failure({ error: { ...e } }))
  }
}

function * handleDeleteMember(action) {
  try {
    const params = action.payload
    yield call(axios.delete, `${CONFIGURATION.host}/api/projects/${params.projectId}/remove_member/${params.email}`)
    const { data } = yield call(axios.get, `${CONFIGURATION.host}/api/projects/${params.projectId}/members`)
    yield put(actionMembers.success({ data }))
  } catch (e) {
    yield put(actionMembers.failure({ error: { ...e } }))
  }
}

function * watchMemebersSagas() {
  yield [
    takeLatest(API_MEMBERS.REQUEST, handleGetMembers),
    takeLatest(API_MEMBERS.CREATE, handleCreateMember),
    takeLatest(API_MEMBERS.DELETE, handleDeleteMember)
  ]
}

export default watchMemebersSagas
