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
  API_WATCHERS
} from '../actions/types'

import {
  actionWatchers
} from '../actions'

function * handleGetWatchers(action) {
  try {
    const { project_id, story_id } = action.payload
    const url = `${CONFIGURATION.host}/api/projects/${project_id}/stories/${story_id}/watchers`
    const { data } = yield call(axios.get, url)
    yield put(actionWatchers.success({ data }))
  } catch (e) {
    yield put(actionWatchers.failure({ error: { ...e } }))
  }
}

function * handleWatchStory(action) {
  try {
    const { project_id, story_id } = action.payload
    const url = `${CONFIGURATION.host}/api/projects/${project_id}/stories/${story_id}/watch`
    const { data } = yield call(axios.post, url)
    yield put(actionWatchers.success({ data }))
  } catch (e) {
    yield put(actionWatchers.failure({ error: { ...e } }))
  }
}

function * handleUnwatchStory(action) {
  try {
    const { project_id, story_id } = action.payload
    const url = `${CONFIGURATION.host}/api/projects/${project_id}/stories/${story_id}/unwatch`
    const { data } = yield call(axios.post, url)
    yield put(actionWatchers.success({ data }))
  } catch (e) {
    yield put(actionWatchers.failure({ error: { ...e } }))
  }
}

function * watchWatchersSagas() {
  yield [
    takeLatest(API_WATCHERS.REQUEST, handleGetWatchers),
    takeLatest(API_WATCHERS.WATCH, handleWatchStory),
    takeLatest(API_WATCHERS.UNWATCH, handleUnwatchStory),
  ]
}

export default watchWatchersSagas