// In case you need to use a selector
// import also select from redux-saga/effects
// and then simplie yield select(yourSelector())
//
// In case you need to redirect to whatever route
import { push } from 'react-router-redux'
// yield put(push('/next-page'))
import 'babel-polyfill'
import 'babel-regenerator-runtime'
import { put, call, takeLatest } from 'redux-saga/lib/effects'
import axios from 'axios'
import { CONFIGURATION } from '../config/index'

import {
  API_USER
} from '../actions/types'

import {
  actionUser
} from '../actions'

function * handleLogOut(action) {
  try {
    const url = `${CONFIGURATION.host}/api/users/logout`
    const { data } = yield call(axios.post, url)
    yield put(actionUser.success({ data }))
    yield window.location.reload()
  } catch (e) {
    yield put(actionUser.failure({ error: { ...e } }))
  }
}

function * handleDeleteAccount(action) {
  try {
    const { data } = yield call(axios.delete, `${CONFIGURATION.host}/api/account`)
    yield window.location.reload()
  } catch (e) {
    yield put(actionUser.failure({ error: { ...e } }))
  }
}


function * watchUserSagas() {
  yield [
    takeLatest(API_USER.LOG_OUT, handleLogOut),
    takeLatest(API_USER.DELETE, handleDeleteAccount),
  ]
}

export default watchUserSagas
