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
  API_FEEDBACK
} from '../actions/types'

import {
  actionFeedback
} from '../actions'

function * handleGetFeedback (action) {
  try {
    const { projectId } = action.payload
    const { data } = yield call(axios.get, `${CONFIGURATION.host}/api/projects/${projectId}/feedback`)
    yield put(actionFeedback.success({ data }))
  } catch (e) {
    yield put(actionFeedback.failure({ error: { ...e } }))
  }
}

function * watchFeedbackSagas () {
  yield [
    takeLatest(API_FEEDBACK.REQUEST, handleGetFeedback)
  ]
}

export default watchFeedbackSagas
