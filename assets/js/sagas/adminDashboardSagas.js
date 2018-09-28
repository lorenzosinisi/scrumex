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
  API_ADMIN_DASHBOARD
} from '../actions/types'

import {
  actionAdminDashboard
} from '../actions'

function * handleGetAdminDashboard (action) {
  try {
    const { data } = yield call(axios.get, `${CONFIGURATION.host}/api/admin/dashboard`)
    yield put(actionAdminDashboard.success({ data }))
  } catch (e) {
    yield put(actionAdminDashboard.failure({ error: { ...e } }))
  }
}

function * watchAdminDashboardSagas () {
  yield [
    takeLatest(API_ADMIN_DASHBOARD.REQUEST, handleGetAdminDashboard)
  ]
}

export default watchAdminDashboardSagas
