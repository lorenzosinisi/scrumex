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
  API_ACCOUNT
} from '../actions/types'

import {
  actionAccount
} from '../actions'

function * handleGetAccount (action) {
  try {
    const { data } = yield call(axios.get, `${CONFIGURATION.host}/api/account`)
    yield put(actionAccount.success({ data }))
  } catch (e) {
    yield put(actionAccount.failure({ error: { ...e } }))
  }
}

function * watchAccountSagas () {
  yield [
    takeLatest(API_ACCOUNT.REQUEST, handleGetAccount)
  ]
}

export default watchAccountSagas
