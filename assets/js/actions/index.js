import { createAction } from '../utils'
import {
  API_PROJECT,
  API_STORY,
  API_RESET_STORY,
  API_GET_MY_PROJECTS,
  API_DELETE_PROJECT,
  API_GET_REPOS,
  API_GET_SPRINTS,
  API_RESET_SPRINTS,
  API_GET_PROJECT,
  API_POST_PROJECT,
  API_POST_ISSUE,
  API_POST_SPRINT,
  API_DELETE_SPRINT,
  API_GET_ISSUES,
  API_GET_VOTING_ISSUE,
  API_RESET_VOTING_ISSUE,
  API_DELETE_ISSUE,
  API_SET_ISSUE_TO_SPRINT,
  API_SPRINT,
  API_WATCHERS,
  API_TEAM,
  RESET_ENTRIES,
  API_GET_ENTRIES,
  API_USER,
  API_COMMENTS,
  API_BURNDOWNCHART,
  API_ATTACHMENT_UPLOAD,
  API_SEARCH_STORIES,
  API_MEMBERS,
  API_ACCOUNT,
  API_FEEDBACK,
  API_ADMIN_DASHBOARD
} from './types'


export const actionAdminDashboard = {
  request: ()  => createAction(API_ADMIN_DASHBOARD.REQUEST, {loading: true, success: false, error: null }),
  reset:   (data)  => createAction(API_ADMIN_DASHBOARD.RESET,  { ...data, loading: true, success: false, error: null }),
  success: (data)  => createAction(API_ADMIN_DASHBOARD.SUCCESS, { ...data, loading: false, success: true, error: null }),
  failure: (error) => createAction(API_ADMIN_DASHBOARD.FAILURE, { ...error, loading: false, success: false })
}

export const actionMembers = {
  request: (projectId)  => createAction(API_MEMBERS.REQUEST, { projectId, loading: true, success: false, error: null }),
  create: (email, projectId)  => createAction(API_MEMBERS.CREATE, { email, projectId, loading: true, success: false, error: null }),
  delete: (email, projectId)  => createAction(API_MEMBERS.DELETE, { email, projectId, loading: true, success: false, error: null }),
  reset:   (data)  => createAction(API_MEMBERS.RESET,  { ...data, loading: true, success: false, error: null }),
  success: (data)  => createAction(API_MEMBERS.SUCCESS, { ...data, loading: false, success: true, error: null }),
  failure: (error) => createAction(API_MEMBERS.FAILURE, { ...error, loading: false, success: false })
}


export const actionFeedback = {
  request: (projectId)  => createAction(API_FEEDBACK.REQUEST, { projectId, loading: true, success: false, error: null }),
  success: (data)  => createAction(API_FEEDBACK.SUCCESS, { ...data, loading: false, success: true, error: null }),
  failure: (error) => createAction(API_FEEDBACK.FAILURE, { ...error, loading: false, success: false })
}

export const actionAccount = {
  request: ()  => createAction(API_ACCOUNT.REQUEST, {loading: true, success: false, error: null }),
  reset:   (data)  => createAction(API_ACCOUNT.RESET,  { ...data, loading: true, success: false, error: null }),
  success: (data)  => createAction(API_ACCOUNT.SUCCESS, { ...data, loading: false, success: true, error: null }),
  failure: (error) => createAction(API_ACCOUNT.FAILURE, { ...error, loading: false, success: false })
}


export const actionComments = {
  request: (data)  => createAction(API_COMMENTS.REQUEST, { ...data, loading: true, success: false, error: null }),
  create: (data) => createAction(API_COMMENTS.CREATE, { ...data, loading: true, success: false, error: null }),
  delete:  (data, comment_id)  => createAction(API_COMMENTS.DELETE, { ...data, comment_id, loading: true, success: false, error: null }),
  reset:   (data)  => createAction(API_COMMENTS.RESET,  { ...data, loading: true, success: false, error: null }),
  success: (data)  => createAction(API_COMMENTS.SUCCESS, { ...data, loading: false, success: true, error: null }),
  failure: (error) => createAction(API_COMMENTS.FAILURE, { ...error, loading: false, success: false })
}


export const actionSearchStories = {
  request: (term, project_id)  => createAction(API_SEARCH_STORIES.REQUEST, { term, project_id, loading: true, success: false, error: null }),
  reset:   (data)  => createAction(API_SEARCH_STORIES.RESET,  { ...data, loading: true, success: false, error: null }),
  success: (data)  => createAction(API_SEARCH_STORIES.SUCCESS, { ...data, loading: false, success: true, error: null }),
  failure: (error) => createAction(API_SEARCH_STORIES.FAILURE, { ...error, loading: false, success: false })
}

export const actionAttachmentUploads = {
  request: (data)  => createAction(API_ATTACHMENT_UPLOAD.REQUEST, { ...data, loading: true, success: false, error: null }),
  create: (data) => createAction(API_ATTACHMENT_UPLOAD.CREATE, { ...data, loading: true, success: false, error: null }),
  delete:  (data, attachment_id)  => createAction(API_ATTACHMENT_UPLOAD.DELETE, { ...data, attachment_id, loading: true, success: false, error: null }),
  success: (data)  => createAction(API_ATTACHMENT_UPLOAD.SUCCESS, { ...data, loading: false, success: true, error: null }),
  failure: (error) => createAction(API_ATTACHMENT_UPLOAD.FAILURE, { ...error, loading: false, success: false })
}

export const actionWatchers = {
  request: (data) => createAction(API_WATCHERS.REQUEST, { ...data, loading: true, success: false, error: null }),
  watch: (data) => createAction(API_WATCHERS.WATCH, { ...data, loading: true, success: false, error: null }),
  unwatch: (data) => createAction(API_WATCHERS.UNWATCH, { ...data, loading: true, success: false, error: null }),
  reset: (data) => createAction(API_WATCHERS.RESET, { ...data, loading: true, success: false, error: null }),
  success: (data) => createAction(API_WATCHERS.SUCCESS, { ...data, loading: false, success: true, error: null }),
  failure: (error) => createAction(API_WATCHERS.FAILURE, { ...error, loading: false, success: false })
}

export const actionUser = {
  logOut: (data) => createAction(API_USER.LOG_OUT, { loading: true, success: false, error: null }),
  deleteAccount: () => createAction(API_USER.DELETE, { loading: true, success: false, error: null }),
  success: (data) => createAction(API_USER.SUCCESS, { ...data, loading: false, success: true, error: null }),
  failure: (error) => createAction(API_USER.FAILURE, { ...error, loading: false, success: false })
}

export const actionStory = {
  complete: (data) => createAction(API_STORY.DONE, { ...data, loading: true, success: false, error: null }),
  reset:    ()      => createAction(API_STORY.RESET),
  rankFirst: (data) => createAction(API_STORY.RANK_FIRST, { ...data, loading: true, success: false, error: null }),
  update: (data) => createAction(API_STORY.UPDATE, { ...data, loading: true, success: false, error: null }),
  rankLast: (data) => createAction(API_STORY.RANK_LAST, { ...data, loading: true, success: false, error: null }),
  rankBetween: (data) => createAction(API_STORY.RANK_BETWEEN, { ...data, loading: true, success: false, error: null }),
  addToSprint: (data) => createAction(API_STORY.ADD_TO_SPRINT, { ...data, loading: true, success: false, error: null }),
  assignToMe: (data) => createAction(API_STORY.ASSIGN_TO_ME, { ...data, loading: true, success: false, error: null }),
  request:  (data) => createAction(API_STORY.REQUEST, { ...data, loading: true, success: false, error: null }),
  success:  (data) => createAction(API_STORY.SUCCESS, { ...data, loading: false, success: true, error: null }),
  failure:  (error) => createAction(API_STORY.FAILURE, { ...error, loading: false, success: false })
}

export const actionProject = {
  update: (data) => createAction(API_PROJECT.UPDATE, { ...data, loading: true, success: false, error: null }),
  reset:    ()     => createAction(API_PROJECT.RESET),
  success:  (data) => createAction(API_PROJECT.SUCCESS, { ...data, loading: false, success: true, error: null }),
  failure:  (error) => createAction(API_PROJECT.FAILURE, { ...error, loading: false, success: false })
}

export const actionTeam = {
  reset:    (data) => createAction(API_TEAM.RESET,   { loading: true, success: false, error: null }),
  request:  (data) => createAction(API_TEAM.REQUEST,  { ...data, loading: true, success: false, error: null }),
  success:  (data) => createAction(API_TEAM.SUCCESS,  { ...data, loading: false, success: true, error: null }),
  failure:  (error) => createAction(API_TEAM.FAILURE, { ...error, loading: false, success: false })
}

export const actionSprint = {
  complete: (data) => createAction(API_SPRINT.DONE,     { ...data, loading: true, success: false, error: null }),
  burndownchart: (data) => createAction(API_SPRINT.BURNDOWNCHART, { ...data, loading: true, success: false, error: null }),
  reset:     (data) => createAction(API_SPRINT.RESET,   { loading: true, success: false, error: null }),
  request:  (data) => createAction(API_SPRINT.REQUEST,  { ...data, loading: true, success: false, error: null }),
  success:  (data) => createAction(API_SPRINT.SUCCESS,  { ...data, loading: false, success: true, error: null }),
  failure:  (error) => createAction(API_SPRINT.FAILURE, { ...error, loading: false, success: false })
}

export const actionGetBurndownchart = {
  reset:     (data) => createAction(API_BURNDOWNCHART.RESET,   { loading: true, success: false, error: null }),
  request:  (data) => createAction(API_BURNDOWNCHART.REQUEST,  { ...data, loading: true, success: false, error: null }),
  success:  (data) => createAction(API_BURNDOWNCHART.SUCCESS,  { ...data, loading: false, success: true, error: null }),
  failure:  (error) => createAction(API_BURNDOWNCHART.FAILURE, { ...error, loading: false, success: false })
}

export const actionresetSprints     = createAction(API_RESET_SPRINTS)
export const actionresetStory       = createAction(API_RESET_STORY)
export const actionResetVotingIssue = createAction(API_RESET_VOTING_ISSUE)

export const actionGetVotingIssue = {
  request: (data) => createAction(API_GET_VOTING_ISSUE.REQUEST, { ...data, loading: true, success: false, error: null }),
  success: (data) => createAction(API_GET_VOTING_ISSUE.SUCCESS, { ...data, loading: false, success: true, error: null }),
  failure: (error) => createAction(API_GET_VOTING_ISSUE.FAILURE, { ...error, loading: false, success: false })
}

export const actionResetStoreEntries = createAction(RESET_ENTRIES)

export const actionGetEntries = {
  request: (data) => createAction(API_GET_ENTRIES.REQUEST, { ...data, loading: true, success: false, error: null }),
  success: (data) => createAction(API_GET_ENTRIES.SUCCESS, { ...data, loading: false, success: true, error: null }),
  failure: (error) => createAction(API_GET_ENTRIES.FAILURE, { ...error, loading: false, success: false })
}

export const actionGetRepos = {
  request: (userToken) => createAction(API_GET_REPOS.REQUEST, { userToken, loading: true, success: false, error: null }),
  success: (data) => createAction(API_GET_REPOS.SUCCESS, { ...data, loading: false, success: true, error: null }),
  failure: (error) => createAction(API_GET_REPOS.FAILURE, { ...error, loading: false, success: false })
}

export const actionGetSprints = {
  request: (projectId) => createAction(API_GET_SPRINTS.REQUEST, { projectId, loading: true, success: false, error: null }),
  success: (data) => createAction(API_GET_SPRINTS.SUCCESS, { ...data, loading: false, success: true, error: null }),
  failure: (error) => createAction(API_GET_SPRINTS.FAILURE, { ...error, loading: false, success: false })
}

export const actionGetMyProjects = {
  request: (user_token) => createAction(API_GET_MY_PROJECTS.REQUEST, { user_token, loading: true, success: false, error: null }),
  success: (data) => createAction(API_GET_MY_PROJECTS.SUCCESS, { ...data, loading: false, success: true, error: null }),
  failure: (error) => createAction(API_GET_MY_PROJECTS.FAILURE, { ...error, loading: false, success: false })
}

export const actionGetProject = {
  request: (userToken, projectId) => createAction(API_GET_PROJECT.REQUEST, { userToken, projectId, loading: true, success: false, error: null }),
  success: (data) => createAction(API_GET_PROJECT.SUCCESS, { ...data, loading: false, success: true, error: null }),
  failure: (error) => createAction(API_GET_PROJECT.FAILURE, { ...error, loading: false, success: false })
}

export const actionDeleteProject = {
  request: (projectId) => createAction(API_DELETE_PROJECT.REQUEST, { projectId, loading: true, success: false, error: null }),
  success: (data) => createAction(API_DELETE_PROJECT.SUCCESS, { ...data, loading: false, success: true, error: null }),
  failure: (error) => createAction(API_DELETE_PROJECT.FAILURE, { ...error, loading: false, success: false })
}

export const actionCreateProject = {
  save: (data) => createAction(API_POST_PROJECT.SAVE, { ...data, loading: true, success: false, error: null }),
  success: (data) => createAction(API_POST_PROJECT.SUCCESS, { ...data, loading: false, success: true, error: null }),
  failure: (error) => createAction(API_POST_PROJECT.FAILURE, { ...error, loading: false, success: false })
}

export const actionCreateSprint = {
  save: (data) => createAction(API_POST_SPRINT.SAVE, { ...data, loading: true, success: false, error: null }),
  success: (data) => createAction(API_POST_SPRINT.SUCCESS, { ...data, loading: false, success: true, error: null }),
  failure: (error) => createAction(API_POST_SPRINT.FAILURE, { ...error, loading: false, success: false })
}

export const actionCreateIssue = {
  save: (data) => createAction(API_POST_ISSUE.SAVE, { ...data, loading: true, success: false, error: null }),
  success: (data) => createAction(API_POST_ISSUE.SUCCESS, { ...data, loading: false, success: true, error: null }),
  failure: (error) => createAction(API_POST_ISSUE.FAILURE, { ...error, loading: false, success: false })
}

export const actionDeleteSprint = {
  request: (data) => createAction(API_DELETE_SPRINT.REQUEST, { ...data, loading: true, success: false, error: null }),
  success: (data) => createAction(API_DELETE_SPRINT.SUCCESS, { ...data, loading: false, success: true, error: null }),
  failure: (error) => createAction(API_DELETE_SPRINT.FAILURE, { ...error, loading: false, success: false })
}

export const actionGetIssues = {
  request: (projectId) => createAction(API_GET_ISSUES.REQUEST, { projectId, loading: true, success: false, error: null }),
  success: (data) => createAction(API_GET_ISSUES.SUCCESS, { ...data, loading: false, success: true, error: null }),
  failure: (error) => createAction(API_GET_ISSUES.FAILURE, { ...error, loading: false, success: false })
}

export const actionDeleteIssue = {
  request: (data) => createAction(API_DELETE_ISSUE.REQUEST, { ...data, loading: true, success: false, error: null }),
  success: (data) => createAction(API_DELETE_ISSUE.SUCCESS, { ...data, loading: false, success: true, error: null }),
  failure: (error) => createAction(API_DELETE_ISSUE.FAILURE, { ...error, loading: false, success: false })
}

export const actionSetIssueToSprint = {
  request: (data) => createAction(API_SET_ISSUE_TO_SPRINT.REQUEST, { ...data, loading: true, success: false, error: null }),
  success: (data) => createAction(API_SET_ISSUE_TO_SPRINT.SUCCESS, { ...data, loading: false, success: true, error: null }),
  failure: (error) => createAction(API_SET_ISSUE_TO_SPRINT.FAILURE, { ...error, loading: false, success: false })
}
