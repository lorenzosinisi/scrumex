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
  API_SEARCH_STORIES
} from '../actions/types'

import {
  actionSearchStories
} from '../actions'

function * handleSearchStories (action) {
  try {
    const { project_id, term } = action.payload
    const { data } = yield call(axios.get, `${CONFIGURATION.host}/api/projects/${project_id}/search_stories?term=${term}`)
    yield put(actionSearchStories.success({ data }))
  } catch (e) {
    yield put(actionSearchStories.failure({ error: { ...e } }))
  }
}

function * watchSearchStoriesSagas () {
  yield [
    takeLatest(API_SEARCH_STORIES.REQUEST, handleSearchStories)
  ]
}

export default watchSearchStoriesSagas
