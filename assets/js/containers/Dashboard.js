import React, { Component } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import CardItem from '../components/dashboard/cardItem'
import DashboardTitle from '../components/dashboard/dashboardTitle'
import StoriesTable from '../components/stories/storiesTable'
import SprintsTable from '../components/sprints/SprintsTable'
import WithExternalLinks from '../hocs/WithExternalLinks'
// MUI
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography';
import GroupWork from 'material-ui-icons/GroupWork'
import Inbox from 'material-ui-icons/Inbox'
import Assignment from 'material-ui-icons/Assignment'
import pink from 'material-ui/colors/pink';
import green from 'material-ui/colors/green';
import Avatar from 'material-ui/Avatar';
import _ from 'lodash'

import {
  actionProject,
  actionGetProject,
  actionGetIssues,
  actionGetSprints
} from '../actions'

import {
  currentProjectSelector,
  loadingSelector,
  errorSelector
} from '../selectors/showProjectSelector'

import {
  userSelector
} from '../selectors/userSelector'

import {
  issuesSelector
} from '../selectors/issuesSelector'

import {
  sprintsSelector
} from '../selectors/sprintsSelector'

const styles = theme => ({
  main: theme.mixins.gutters({
    width: '98%',
    margin: '0 auto',
    maxWidth: 1200,
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit,
  }),
  avatar: {
    margin: 10,
    margin: '0 auto',
    width: 75,
    height: 75,
    float: 'left'
  },
  pinkAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: '#f3c041',
    margin: '0 auto',
    width: 75,
    height: 75,
    float: 'left'
  },
  greenAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: '#0b9899',
    margin: '0 auto',
    width: 75,
    height: 75,
    float: 'left'
  },
  cardItems: {
    minHeight: 160,
    marginLeft: 10,
    marginRight: 10
  },
  storiesTable: {
    padding: 15,
    'margin-left': 7,
    'margin-right': 4,
  },
  sprintsTabe: {
    'padding-left': 19,
    'padding-right': 19,
  }
})

class Dashboard extends Component {
  componentDidMount () {
    const { user } = this.props
    this.props.loadCurrentProject(user, this.props.match.params.project_id)
    this.props.loadStories(this.props.match.params.project_id)
    this.props.loadSprints(this.props.match.params.project_id)
  }

  render() {
    const { classes, project} = this.props
    const backlogCount = project.backlog && project.backlog.length || 0

    const storiesClosed = _.filter(this.props.stories, function(story) {
      return story.closed == true
    })

    const storiesCount = storiesClosed.length

    const sprintsCount = project.active_sprints && project.active_sprints.length || 0
    const userId = this.props.user.id

    const myStories = _.filter(this.props.stories, function(story) {
      return story.assignee_id == userId && story.closed != true
    })

    const currentSprints = _.filter(this.props.sprints, function(sprint) {
      return sprint.closed != true
    })

    return <div className={classes.main}>
      <DashboardTitle title={project.name} />
      <div className={classes.cardItems}>
        {backlogCount != 0 && <CardItem link={`/app/projects/${project.id}/`} title="view"  counter={`backlog items`} icon={<Avatar className={classes.avatar}>{`${backlogCount}`}</Avatar>}/>}
        {backlogCount == 0 && <CardItem link={`/app/projects/${project.id}/stories/new`} title="new"  counter={`backlog items`} icon={<Avatar className={classes.avatar}>{`${backlogCount}`}</Avatar>}/>}
        {sprintsCount != 0 && <CardItem link={`/app/projects/${project.id}/sprints`} title="view" counter={`active sprints`} icon={<Avatar className={classes.pinkAvatar}>{`${sprintsCount}`}</Avatar>}/>}
        {sprintsCount == 0 && <CardItem link={`/app/projects/${project.id}/sprints/new`} title="new" counter={`active sprints`} icon={<Avatar className={classes.pinkAvatar}>{`${sprintsCount}`}</Avatar>}/>}
        <CardItem title={null} counter={`stories done`} icon={<Avatar className={classes.greenAvatar}>{`${storiesCount}`}</Avatar>}/>
      </div>
      <DashboardTitle title={"Stories assigned to me"} />
      <div className={classes.storiesTable}><StoriesTable data={myStories} /></div>

      <DashboardTitle title={"Current sprints"} />
      <div className={classes.sprintsTabe}><SprintsTable data={currentSprints} /></div>

    </div>
  }
}

const mapStateToProps = createStructuredSelector({
  user: userSelector(),
  project: currentProjectSelector(),
  stories: issuesSelector(),
  sprints: sprintsSelector(),
  loading: loadingSelector(),
  error: errorSelector()
})

function mapDispatchToProps (dispatch) {
  return {
    loadCurrentProject: (userToken, projectId) => dispatch(actionGetProject.request(userToken, projectId)),
    loadStories: (projectId)  => dispatch(actionGetIssues.request(projectId)),
    loadSprints: (projectId) => dispatch(actionGetSprints.request(projectId))
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  WithExternalLinks
)(Dashboard)
