import React, { Component } from 'react'
import { compose } from 'recompose'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { Route, Switch, withRouter } from 'react-router-dom'
import ProjectsContainer from './containers/ProjectsContainer'
import Project from './containers/Project'
import StoryNew from './containers/storyNew'
import Sprint from './containers/Sprint'
import Story from './containers/Story'
import NavigationTop from './components/navigation/navigationTop'
import ProjectNew from './containers/ProjectNew'
import SprintNew from './containers/SprintNew'
import StoryVote from './containers/StoryVote'
import StoryEdit from "./containers/storyEdit";
import ProjectEdit from './containers/ProjectEdit'
import LoggedOut from './containers/LoggedOut'
import Sprints from './containers/Sprints'
import Dashboard from './containers/Dashboard'
import Search from './containers/Search'
import Account from './containers/Account'
import Feedback from './containers/Feedback'
import Members from './containers/Members'
import AdminDashboard from './containers/AdminDashboard'

import { userSelector } from './selectors/userSelector'
import { routeSelector } from './selectors/routeSelector'
import { currentProjectSelector } from './selectors/showProjectSelector'
import { sprintSelector } from './selectors/sprintSelector'
import { storySelector } from './selectors/storySelector'
import { actionUser } from './actions'


class App extends Component {
  render () {
    return <div>
        <NavigationTop
          user={this.props.user}
          route={this.props.route}
          logOutAction={this.props.logOutAction}
          project={this.props.project}
          sprint={this.props.sprint}
          story={this.props.story}
        />
        <Switch>
          <Route exact path="/app/" component={ProjectsContainer} />
          <Route exact path="/app/logout" component={LoggedOut} />
          <Route exact path="/app/account" component={Account} />
          <Route exact path="/app/admin/dashboard" component={AdminDashboard} />
          <Route exact path="/app/projects" component={ProjectsContainer} />
          <Route exact path="/app/projects/new" component={ProjectNew} />
          <Route path="/app/projects/:project_id/edit" component={ProjectEdit} />
          <Route path="/app/projects/:project_id/stories/new" component={StoryNew} />
          <Route path="/app/projects/:project_id/stories/:issue_id/vote" component={StoryVote} />
          <Route path="/app/projects/:project_id/stories/:story_id/edit" component={StoryEdit} />
          <Route path="/app/projects/:project_id/stories/:story_id" component={Story} />
          <Route path="/app/projects/:project_id/sprints/new" component={SprintNew} />
          <Route path="/app/projects/:project_id/sprints/:sprint_id" component={Sprint} />
          <Route path="/app/projects/:project_id/sprints" component={Sprints} />
          <Route path="/app/projects/:project_id/dashboard" component={Dashboard} />
          <Route path="/app/projects/:project_id/search" component={Search} />
          <Route path="/app/projects/:project_id/members" component={Members} />
          <Route path="/app/projects/:project_id/feedback" component={Feedback} />
          <Route path="/app/projects/:project_id" component={Project} />
        </Switch>
      </div>
  }
}


const mapStateToProps = createStructuredSelector({
  route: routeSelector(),
  user: userSelector(),
  project: currentProjectSelector(),
  sprint: sprintSelector(),
  story: storySelector()
})

function mapDispatchToProps(dispatch) {
  return {
    logOutAction: () => dispatch(actionUser.logOut()),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(App)
