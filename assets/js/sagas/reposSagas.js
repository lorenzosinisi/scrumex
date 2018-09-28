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
  API_GET_REPOS
} from '../actions/types'

import {
  actionGetRepos
} from '../actions'

function * handleGetRepos (action) {
  try {
    const { userToken } = action.payload
    const { data } = yield call(axios.get, `${CONFIGURATION.host}/api/github/repos/?user_token=${userToken}`)
    yield put(actionGetRepos.success({ data }))
  } catch (e) {
    yield put(actionGetRepos.failure({ error: { ...e } }))
  }
}

function * watchReposSagas () {
  yield [
    takeLatest(API_GET_REPOS.REQUEST, handleGetRepos)
  ]
}

export default watchReposSagas
