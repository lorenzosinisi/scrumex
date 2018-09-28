import React, { Component } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import CardItem from '../components/dashboard/cardItem'
import DashboardTitle from '../components/dashboard/dashboardTitle'
import StoriesTable from '../components/stories/storiesTable'
import SprintsTable from '../components/sprints/SprintsTable'
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
import List, { ListItem, ListItemText } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import { prettyDateTime } from "../utils"

import {
  actionAdminDashboard
} from '../actions'

import {
  userSelector
} from '../selectors/userSelector'

import {
  adminDashboardSelector,
  loadingSelector,
  errorSelector
} from '../selectors/adminDashboardSelector'

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

class AdminDashboard extends Component {
  componentDidMount () {
    this.props.loadDashboard()
  }

  render() {
    const { classes, adminDashboard } = this.props
    return <div className={classes.main}>
      <DashboardTitle title={"Admin Dashboard"} />
      <div className={classes.cardItems}>
        <CardItem title={null}  counter={`Projects`} icon={<Avatar className={classes.avatar}>{`${adminDashboard.projects_count}`}</Avatar>}/>
        <CardItem title={null} counter={`Members`} icon={<Avatar className={classes.pinkAvatar}>{`${adminDashboard.users_count}`}</Avatar>}/>
        <CardItem title={null}      counter={`Stories`} icon={<Avatar className={classes.greenAvatar}>{`${adminDashboard.stories_count}`}</Avatar>}/>
      </div>
      <DashboardTitle title={"Members"} />
      {adminDashboard.users.map(member => {
        return (
          <div key={member.id}>
          <li>
          {member.id} -- {member.email} -- {prettyDateTime(member.inserted_at)}
          <br />
          </li>
          <Divider />
          </div>

        )
      })}

      <DashboardTitle title={"Projects"} />

      {adminDashboard.projects.map(project => {
        return (
          <div key={project.id}>
          <li>
          {project.id} -- {project.name} -- owner {project.user_id} -- {prettyDateTime(project.inserted_at)}
          <br />
          </li>
          <Divider />
          </div>

        )
      })}


      <DashboardTitle title={"Stories"} />

      {adminDashboard.stories.map(story => {
        return (
          <div key={story.id}>
          <li>
          {story.id} -- {story.name} -- created by {story.user_id} -- {prettyDateTime(story.inserted_at)}
          <br />
          </li>
          <Divider />
          </div>
        )
      })}

    </div>
  }
}

const mapStateToProps = createStructuredSelector({
  user: userSelector(),
  adminDashboard: adminDashboardSelector(),
  loading: loadingSelector(),
  error: errorSelector()
})

function mapDispatchToProps (dispatch) {
  return {
    loadDashboard: () => dispatch(actionAdminDashboard.request()),
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(AdminDashboard)
