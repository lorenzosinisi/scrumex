import { createActionTypes } from '../utils'

export const API_ADMIN_DASHBOARD = createActionTypes('API_ADMIN_DASHBOARD', [
  'REQUEST',
  'RESET',
  'SUCCESS',
  'FAILURE']
)

export const API_MEMBERS = createActionTypes('API_MEMBERS', [
  'REQUEST',
  'RESET',
  'SUCCESS',
  'CREATE',
  'DELETE',
  'FAILURE']
)

export const API_FEEDBACK = createActionTypes('API_FEEDBACK', [
  'REQUEST',
  'SUCCESS',
  'CREATE',
  'FAILURE']
)


export const API_ACCOUNT = createActionTypes('API_ACCOUNT', [
  'REQUEST',
  'RESET',
  'SUCCESS',
  'FAILURE']
)

export const API_SEARCH_STORIES = createActionTypes('API_SEARCH_STORIES', [
  'REQUEST',
  'RESET',
  'SUCCESS',
  'FAILURE']
)


export const API_USER = createActionTypes('API_USER', [
  'LOG_OUT',
  'SUCCESS',
  'DELETE',
  'FAILURE']
)

export const API_COMMENTS = createActionTypes('API_COMMENTS', [
  'REQUEST',
  'CREATE',
  'DELETE',
  'RESET',
  'SUCCESS',
  'FAILURE']
)

export const API_ATTACHMENT_UPLOAD = createActionTypes('API_ATTACHMENT_UPLOAD', [
  'REQUEST',
  'CREATE',
  'DELETE',
  'SUCCESS',
  'FAILURE']
)

export const API_WATCHERS = createActionTypes('API_WATCHERS', [
  'REQUEST',
  'WATCH',
  'UNWATCH',
  'RESET',
  'SUCCESS',
  'FAILURE']
)

export const API_STORY = createActionTypes('API_STORY', [
  'DONE',
  'RESET',
  'REQUEST',
  'UPDATE',
  'ASSIGN_TO_ME',
  'RANK_LAST',
  'RANK_FIRST',
  'RANK_BETWEEN',
  'ADD_TO_SPRINT',
  'SUCCESS',
  'FAILURE']
)

export const API_TEAM = createActionTypes('API_TEAM', [
  'RESET',
  'REQUEST',
  'SUCCESS',
  'FAILURE'
])

export const API_SPRINT = createActionTypes('API_SPRINT', [
  'DONE',
  'RESET',
  'REQUEST',
  'SUCCESS',
  'BURNDOWNCHART',
  'FAILURE']
)

export const API_BURNDOWNCHART = createActionTypes('API_BURNDOWNCHART', [
  'REQUEST',
  'RESET',
  'SUCCESS',
  'FAILURE']
)

export const API_RESET_VOTING_ISSUE = 'API_RESET_VOTING_ISSUE'
export const API_RESET_SPRINTS      = 'API_RESET_SPRINTS'
export const API_RESET_STORY        = 'API_RESET_STORY'

export const API_GET_VOTING_ISSUE = createActionTypes('API_GET_VOTING_ISSUE', [
  'REQUEST',
  'SUCCESS',
  'FAILURE']
)

export const RESET_ENTRIES = 'RESET_ENTRIES'

export const API_GET_ENTRIES = createActionTypes('API_GET_ENTRIES', [
  'REQUEST',
  'SUCCESS',
  'FAILURE']
)

export const API_GET_REPOS = createActionTypes('API_GET_REPOS', [
  'REQUEST',
  'SUCCESS',
  'FAILURE']
)

export const API_GET_SPRINTS = createActionTypes('API_GET_SPRINTS', [
  'REQUEST',
  'SUCCESS',
  'FAILURE']
)

export const API_DELETE_PROJECT = createActionTypes('API_DELETE_PROJECT', [
  'REQUEST',
  'SUCCESS',
  'FAILURE']
)

export const API_GET_MY_PROJECTS = createActionTypes('API_GET_MY_PROJECTS', [
  'REQUEST',
  'SUCCESS',
  'FAILURE']
)

export const API_GET_PROJECT = createActionTypes('API_GET_PROJECT', [
  'REQUEST',
  'SUCCESS',
  'FAILURE']
)

export const API_PROJECT = createActionTypes('API_PROJECT', [
  'UPDATE',
  'SUCCESS',
  'UPGRADE',
  'FAILURE']
)

export const API_POST_PROJECT = createActionTypes('API_POST_PROJECT', [
  'SAVE',
  'SUCCESS',
  'FAILURE']
)

export const API_POST_ISSUE = createActionTypes('API_POST_ISSUE', [
  'SAVE',
  'SUCCESS',
  'FAILURE']
)

export const API_POST_SPRINT = createActionTypes('API_POST_SPRINT', [
  'SAVE',
  'SUCCESS',
  'FAILURE']
)

export const API_DELETE_SPRINT = createActionTypes('API_DELETE_SPRINT', [
  'REQUEST',
  'SUCCESS',
  'FAILURE']
)

export const API_GET_ISSUES = createActionTypes('API_GET_ISSUES', [
  'REQUEST',
  'SUCCESS',
  'FAILURE']
)

export const API_DELETE_ISSUE = createActionTypes('API_DELETE_ISSUE', [
  'REQUEST',
  'SUCCESS',
  'FAILURE']
)

export const API_SET_ISSUE_TO_SPRINT = createActionTypes('API_SET_ISSUE_TO_SPRINT', [
  'REQUEST',
  'SUCCESS',
  'FAILURE']
)
