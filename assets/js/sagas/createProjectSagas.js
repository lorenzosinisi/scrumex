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
  API_POST_PROJECT
} from '../actions/types'

import {
  actionCreateProject
} from '../actions'

function * handleCreateProject (action) {
  try {
    const { data } = yield call(axios.post, `${CONFIGURATION.host}/api/projects/create/`, { project: action.payload })
    yield put(actionCreateProject.success({ data }))
    yield put(push(`/app/projects/${data.id}/members`))
  } catch (e) {
    yield put(actionCreateProject.failure({ error: { ...e } }))
  }
}

function * watchCreateProjectSagas () {
  yield [
    takeLatest(API_POST_PROJECT.SAVE, handleCreateProject)
  ]
}

export default watchCreateProjectSagas
