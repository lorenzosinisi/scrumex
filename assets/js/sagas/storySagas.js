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
  API_STORY
} from '../actions/types'

import {
  actionStory,
  actionGetProject,
  actionWatchers
} from '../actions'

function * handleGetStory (action) {
  try {
    const { project_id, story_id } = action.payload
    const url = `${CONFIGURATION.host}/api/projects/${project_id}/stories/${story_id}`
    const { data } = yield call(axios.get, url)
    yield put(actionStory.success({ data }))
  } catch (e) {
    yield put(actionStory.failure({ error: { ...e } }))
  }
}

function * handleAssignToMe (action) {
  try {
    const { project_id, story_id } = action.payload
    const url = `${CONFIGURATION.host}/api/projects/${project_id}/stories/${story_id}/assign_to_me`
    yield call(axios.patch, url)

    const getUlr = `${CONFIGURATION.host}/api/projects/${project_id}/stories/${story_id}`
    const { data } = yield call(axios.get, getUlr)
    yield put(actionWatchers.watch(action.payload))
    yield put(actionStory.success({ data }))
  } catch (e) {
    yield put(actionStory.failure({ error: { ...e } }))
  }
}

function * handleRankFirst (action) {
  try {
    const { project_id, id } = action.payload
    const url = `${CONFIGURATION.host}/api/projects/${project_id}/stories/${id}/rank_first`
    const { data } = yield call(axios.patch, url)
    let projectId = project_id
    yield put(actionGetProject.request(null, projectId))
  } catch (e) {
    yield put(actionStory.failure({ error: { ...e } }))
  }
}

function * handleRankLast (action) {
  try {
    const { project_id, id } = action.payload
    const url = `${CONFIGURATION.host}/api/projects/${project_id}/stories/${id}/rank_last`
    const { data } = yield call(axios.patch, url)
    let projectId = project_id
    yield put(actionGetProject.request(null, projectId))
  } catch (e) {
    yield put(actionStory.failure({ error: { ...e } }))
  }
}

function * handleRankBetween (action) {
  try {
    const { project_id, id, prev_story, next_story } = action.payload
    const url = `${CONFIGURATION.host}/api/projects/${project_id}/stories/${id}/rank_between`
    const { data } = yield call(axios.patch, url, { prev_story, next_story })
    let projectId = project_id
    yield put(actionGetProject.request(null, projectId))
  } catch (e) {
    yield put(actionStory.failure({ error: { ...e } }))
  }
}

function * handleUpdate(action) {
  try {
    const { description, title, id, project_id, list_id, onSuccess } = action.payload
    const urlUpdate = `${CONFIGURATION.host}/api/projects/${project_id}/stories/${id}/update`
    yield call(axios.patch, urlUpdate, { description, title, list_id })
    const url = `${CONFIGURATION.host}/api/projects/${project_id}/stories/${id}`
    const { data } = yield call(axios.get, url)
    yield put(actionStory.success({ data }))
    yield onSuccess()
  } catch (e) {
    yield put(actionStory.failure({ error: { ...e } }))
  }
}

function * handleAddToSprint (action) {
  try {
    const { storyId, projectId, sprintId } = action.payload
    const { data } = yield call(axios.patch,
      `${CONFIGURATION.host}/api/projects/${projectId}/stories/${storyId}/add_to_sprint`, { sprint_id: sprintId })
    yield put(actionStory.success({ data }))
  } catch (e) {
    yield put(actionStory.failure({ error: { ...e } }))
  }
}

function * handleMarkAsDone (action) {
  try {
    const { project_id, story_id } = action.payload
    const url = `${CONFIGURATION.host}/api/projects/${project_id}/stories/${story_id}/close`
    const { data } = yield call(axios.patch, url)
    yield put(actionStory.success({ data }))
    yield put(actionWatchers.watch(action.payload))
  } catch (e) {
    yield put(actionStory.failure({ error: { ...e } }))
  }
}

function * watchStorySagas () {
  yield [
    takeLatest(API_STORY.REQUEST, handleGetStory),
    takeLatest(API_STORY.DONE,    handleMarkAsDone),
    takeLatest(API_STORY.ASSIGN_TO_ME, handleAssignToMe),
    takeLatest(API_STORY.RANK_FIRST, handleRankFirst),
    takeLatest(API_STORY.RANK_LAST, handleRankLast),
    takeLatest(API_STORY.RANK_BETWEEN, handleRankBetween),
    takeLatest(API_STORY.UPDATE, handleUpdate),
    takeLatest(API_STORY.ADD_TO_SPRINT, handleAddToSprint)
  ]
}

export default watchStorySagas
