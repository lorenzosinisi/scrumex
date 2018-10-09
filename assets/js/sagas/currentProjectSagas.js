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
import { push } from 'react-router-redux'
import axios from 'axios'
import { CONFIGURATION } from '../config/index'

import {
  API_GET_PROJECT,
  API_PROJECT
} from '../actions/types'

import {
  actionGetProject,
  actionProject
} from '../actions'

function * handleGetProject (action) {
  try {
    const { userToken, projectId } = action.payload
    const url = `${CONFIGURATION.host}/api/projects/${projectId}/?user_token=${userToken}`
    const { data } = yield call(axios.get, url)
    yield put(actionGetProject.success({ data }))
  } catch (e) {
    yield put(actionGetProject.failure({ error: { ...e } }))
  }
}

function * handleUpdateProject (action) {
  try {
    const { id } = action.payload
    const url = `${CONFIGURATION.host}/api/projects/${id}/update`
    const { data } = yield call(axios.patch, url, { project: action.payload })
    yield put(actionProject.success({ data }))
    yield put(push(`/app/projects/${data.id}/dashboard`))
  } catch (e) {
    yield put(actionProject.failure({ error: { ...e } }))
  }
}

function * handleUpgradeProject (action) {
  try {
    const url = `${CONFIGURATION.host}/api/projects/${action.payload.project.id}/upgrade`
    const { data } = yield call(axios.patch, url, action.payload)
    yield put(actionProject.success({ data }))
    yield put(actionGetProject.success({ data }))
  } catch (e) {
    console.log(e)
    yield put(actionProject.failure({ error: { ...e } }))
  }
}

function * watchProjectSagas () {
  yield [
    takeLatest(API_GET_PROJECT.REQUEST, handleGetProject),
    takeLatest(API_PROJECT.UPDATE, handleUpdateProject),
    takeLatest(API_PROJECT.UPGRADE, handleUpgradeProject)
  ]
}

export default watchProjectSagas
