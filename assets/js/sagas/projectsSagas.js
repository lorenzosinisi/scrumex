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
  API_GET_MY_PROJECTS,
  API_DELETE_PROJECT
} from '../actions/types'

import {
  actionGetMyProjects,
  actionDeleteProject
} from '../actions'

function * handleGetMyProjects (action) {
  try {
    const { user_token } = action.payload
    const { data } = yield call(axios.get, `${CONFIGURATION.host}/api/projects/?user_token=${user_token}`)
    yield put(actionGetMyProjects.success({ data }))
  } catch (e) {
    yield put(actionGetMyProjects.failure({ error: { ...e } }))
  }
}

function * handleDeleteProject (action) {
  try {
    const { projectId } = action.payload
    const { data } = yield call(axios.delete, `${CONFIGURATION.host}/api/projects/${projectId}/delete`)
    yield put(actionDeleteProject.success({ data }))
  } catch (e) {
    yield put(actionDeleteProject.failure({ error: { ...e } }))
  }
}

function * watchProjectsSagas () {
  yield [
    takeLatest(API_GET_MY_PROJECTS.REQUEST, handleGetMyProjects),
    takeLatest(API_DELETE_PROJECT.REQUEST, handleDeleteProject)
  ]
}

export default watchProjectsSagas
