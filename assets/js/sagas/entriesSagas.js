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
  API_GET_ENTRIES
} from '../actions/types'

import {
  actionGetEntries
} from '../actions'

function * handleGetEntries (action) {
  try {
    const { projectId, issueId } = action.payload
    const { data } = yield call(axios.get, `${CONFIGURATION.host}/api/projects/${projectId}/issues/${issueId}/entries`)
    yield put(actionGetEntries.success({ data }))
  } catch (e) {
    yield put(actionGetEntries.failure({ error: { ...e } }))
  }
}

function * watchEntriesSagas () {
  yield [
    takeLatest(API_GET_ENTRIES.REQUEST, handleGetEntries)
  ]
}

export default watchEntriesSagas
