import { combineReducers } from 'redux-immutable'
import routeReducer from './routeReducer'
import projectsReducer from './projectsReducer'
import userReducer from './userReducer'
import currentProjectReducer from './currentProjectReducer'
import createdProjectReducer from './createdProjectReducer'
import reposReducer from './reposReducer'
import createdIssueReducer from './createdIssueReducer'
import sprintsReducer from './sprintsReducer'
import issuesReducer from './issuesReducer'
import issueReducer from './issueReducer'
import entriesReducer from './entriesReducer'
import storyReducer from './storyReducer'
import sprintReducer from './sprintReducer'
import teamReducer from './teamReducer'
import commentsReducer from './commentsReducer'
import watchersReducer from './watchersReducer'
import burndownchartReducer from './burndownchartReducer'
import attachmentUploadsReducer from './attachmentUploadsReducer'
import searchStoriesReducer from './searchStoriesReducer'
import membersReducer from './membersReducer'
import accountReducer from './accountReducer'
import feedbackReducer from './feedbackReducer'
import adminDashboardReducer from './adminDashboardReducer'

const rootReducer = asyncReducers => {
  return combineReducers({
    route: routeReducer,
    user: userReducer,
    projectsData: projectsReducer,
    currentProject: currentProjectReducer,
    repos: reposReducer,
    createdProject: createdProjectReducer,
    createdIssue: createdIssueReducer,
    sprints: sprintsReducer,
    issues: issuesReducer,
    issue: issueReducer,
    entries: entriesReducer,
    story: storyReducer,
    sprint: sprintReducer,
    team: teamReducer,
    searchStories: searchStoriesReducer,
    comments: commentsReducer,
    watchers: watchersReducer,
    burndownchart: burndownchartReducer,
    attachmentUploads: attachmentUploadsReducer,
    members: membersReducer,
    account: accountReducer,
    feedback: feedbackReducer,
    adminDashboard: adminDashboardReducer,
    ...asyncReducers
  })
}

export default rootReducer
