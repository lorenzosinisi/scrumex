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
import { push } from 'react-router-redux'

import {
  API_GET_SPRINTS,
  API_POST_SPRINT,
  API_DELETE_SPRINT,
  API_SPRINT,
  API_BURNDOWNCHART
} from '../actions/types'

import {
  actionGetSprints,
  actionCreateSprint,
  actionDeleteSprint,
  actionSprint,
  actionGetBurndownchart
} from '../actions'

function * handleGeSprint (action) {
  try {
    const { project_id, sprint_id } = action.payload
    const { data } = yield call(axios.get, `${CONFIGURATION.host}/api/projects/${project_id}/sprints/${sprint_id}`)
    yield put(actionSprint.success({ data }))
  } catch (e) {
    yield put(actionSprint.failure({ error: { ...e } }))
  }
}

function * handleMarkAsComplete (action) {
  try {
    const { project_id, sprint_id } = action.payload
    const url = `${CONFIGURATION.host}/api/projects/${project_id}/sprints/${sprint_id}/close`
    const { data } = yield call(axios.patch, url)
    yield put(actionSprint.success({ data }))
  } catch (e) {
    yield put(actionSprint.failure({ error: { ...e } }))
  }
}


function * handleGeSprints (action) {
  try {
    const projectId = action.payload.projectId
    const { data } = yield call(axios.get, `${CONFIGURATION.host}/api/projects/${projectId}/sprints`)
    yield put(actionGetSprints.success({ data }))
  } catch (e) {
    yield put(actionGetSprints.failure({ error: { ...e } }))
  }
}

function * handleCreateSprint (action) {
  try {
    const { projectId } = action.payload
    const { data } = yield call(axios.post, `${CONFIGURATION.host}/api/projects/${action.payload.projectId}/sprints/new`, { sprint: action.payload })
    yield put(actionCreateSprint.success({ data }))
    yield put(push(`/app/projects/${projectId}/sprints/${data.id}`))
  } catch (e) {
    yield put(actionCreateSprint.failure({ error: { ...e } }))
  }
}

function * handleDeleteSprint (action) {
  try {
    const { projectId } = action.payload
    const { data } = yield call(axios.post, `${CONFIGURATION.host}/api/projects/${action.payload.projectId}/sprints/${action.payload.sprintId}/delete`)
    yield put(actionDeleteSprint.success({ data }))
    yield put(push(`/app/projects/${projectId}/sprints/`))
  } catch (e) {
    yield put(actionDeleteSprint.failure({ error: { ...e } }))
  }
}

function * handleGetBurndownchart (action) {
  try {
    const { project_id, sprint_id } = action.payload
    const { data } = yield call(axios.get, `${CONFIGURATION.host}/api/projects/${project_id}/sprints/${sprint_id}/burndownchart`)
    yield put(actionGetBurndownchart.success({ data }))
  } catch (e) {
    yield put(actionGetBurndownchart.failure({ error: { ...e } }))
  }
}

function * watchSprintsSagas () {
  yield [
    takeLatest(API_GET_SPRINTS.REQUEST, handleGeSprints),
    takeLatest(API_POST_SPRINT.SAVE, handleCreateSprint),
    takeLatest(API_DELETE_SPRINT.REQUEST, handleDeleteSprint),
    takeLatest(API_SPRINT.REQUEST, handleGeSprint),
    takeLatest(API_SPRINT.DONE, handleMarkAsComplete),
    takeLatest(API_SPRINT.BURNDOWNCHART, handleGetBurndownchart)
  ]
}

export default watchSprintsSagas
