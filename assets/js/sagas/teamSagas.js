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
  API_TEAM
} from '../actions/types'

import {
  actionTeam
} from '../actions'

function * handleGetTeam (action) {
  try {
    const { project_id } = action.payload
    const url = `${CONFIGURATION.host}/api/projects/${project_id}/team`
    const { data } = yield call(axios.get, url)
    yield put(actionTeam.success({ data }))
  } catch (e) {
    yield put(actionTeam.failure({ error: { ...e } }))
  }
}


function * watchTeamSagas () {
  yield [
    takeLatest(API_TEAM.REQUEST, handleGetTeam)
  ]
}

export default watchTeamSagas
