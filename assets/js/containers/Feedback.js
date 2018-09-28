import React, { Component } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import WithExternalLinks from '../hocs/WithExternalLinks'
// MUI
import { withStyles } from 'material-ui/styles'
import { withRouter } from 'react-router-dom'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button';
import WithLoader from '../hocs/WithLoader'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import { prettyDateTime } from "../utils"
import { Link } from 'react-router-dom'
import Avatar from 'material-ui/Avatar';
import ImageIcon from 'material-ui-icons/Image';
import Work from 'material-ui-icons/Work'
import GroupWork from 'material-ui-icons/GroupWork'
import BeachAccessIcon from 'material-ui-icons/BeachAccess';

import {
  feedbackSelector,
  loadingSelector,
  errorSelector
} from '../selectors/feedbackSelector'

import {
  actionFeedback,
  actionGetProject
} from '../actions'


const styles = theme => ({
  main: theme.mixins.gutters({
    width: '98%',
    margin: '0 auto',
    maxWidth: 1200,
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit
  }),
  title: {
    padding: theme.spacing.unit * 2,
    paddingLeft: 40
  },
  deleteAccount: {
    float: 'right'
  },
  avatar: {
    margin: 20,
    'margin-left': 5
  },
  dashedDiv: {
    color: 'rgba(0, 0, 0, 0.54)',
    padding: 10,
    'border-width': 2,
    'border-color': 'rgba(0, 0, 0, 0.54)',
    'border-style': 'dashed',
    'border-radius': 5,
    margin: 20
  }
})

function removedFromASprint(props) {
  const { classes, action, inserted_at, resource_id, project_id } = props;
  return (
    <ListItem>
    <Avatar className={classes.avatar}>
        <Work />
      </Avatar>
      <Link target="_blank" to={`/app/projects/${project_id}/stories/${resource_id}`}>
        <ListItemText primary="Story removed from an active sprint. Please consider reviewing carefully the size of a sprint before adding new stories." secondary={prettyDateTime(inserted_at)} />
      </Link>
    </ListItem>
  )
}

function reopened(props) {
  const { classes, action, inserted_at, resource_id, project_id } = props;
  return (
    <ListItem>
    <Avatar className={classes.avatar}>
        <GroupWork />
      </Avatar>
      <Link target="_blank" to={`/app/projects/${project_id}/sprints/${resource_id}`}>
        <ListItemText primary="Sprint previously closed has been reopened again. Please close the sprint only when being sure about it." secondary={prettyDateTime(inserted_at)} />
      </Link>
    </ListItem>
  )
}

function updateWhileBeingInASprint(props) {
  const { classes, action, inserted_at, resource_id, project_id } = props;
  return (
    <ListItem>
    <Avatar className={classes.avatar}>
        <Work />
      </Avatar>
      <Link target="_blank" to={`/app/projects/${project_id}/stories/${resource_id}`}>
        <ListItemText primary="A story has been updated while being part of an active sprint. Please consider reviewing carefully the stories before adding them to a sprint." secondary={prettyDateTime(inserted_at)} />
      </Link>
    </ListItem>
  )
}

function closedWithOpenStories(props) {
  const { classes, action, inserted_at, resource_id, project_id } = props;
  return (
    <ListItem>
      <Avatar className={classes.avatar}>
          <GroupWork />
        </Avatar>
      <Link target="_blank" to={`/app/projects/${project_id}/sprints/${resource_id}`}>
      <ListItemText primary={`A sprint has been closed while containing incomplete stories. Please close all the stories of a sprint first. If this happens again consider adding less stories to the next sprint.`} secondary={`${prettyDateTime(inserted_at)}`} />
      </Link>
    </ListItem>
  )
}

const mapping = {
  "removed_from_a_sprint": removedFromASprint,
  "reopened": reopened,
  "updated_while_being_in_a_sprint": updateWhileBeingInASprint,
  "closed_with_open_stories": closedWithOpenStories
}

class Feedback extends Component {

  componentDidMount() {
    this.props.loadFeedback(this.props.match.params.project_id)
    this.props.loadCurrentProject(null, this.props.match.params.project_id)
  }

  sortById(a, b) {
    if (a.id < b.id) {
      return 1;
    }
    if (a.id > b.id) {
      return -1;
    }
    return 0;
  }

  render() {
    const { classes, feedback, loading } = this.props
    return <div>
        <Typography className={classes.title} type='display1'>Feedback for the last 2 weeks</Typography>

        <div className={classes.main}>
        <List>
          {!loading && feedback.length == 0 && <div className={classes.dashedDiv}> Nothing to show at the moment. Visit this page when you want some feedback on the performance of your team.</div>}
          {feedback.sort(this.sortById).map(f => {
            let Component = mapping[f.action]
            if (!Component) { return <div />}
            return (
              <div key={f.id}>
              <Component {...f} classes={classes} />
              <Divider />
              </div>
            )
          })}
          </List>
        </div>
      </div>
  }
}

const mapStateToProps = createStructuredSelector({
  loading: loadingSelector(),
  error: errorSelector(),
  feedback: feedbackSelector()
})

function mapDispatchToProps (dispatch) {
  return {
    loadFeedback: (projectId) =>  dispatch(actionFeedback.request(projectId)),
    loadCurrentProject: (userId, projectId) => dispatch(actionGetProject.request(userId, projectId)),
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  WithLoader,
  withRouter,
  WithExternalLinks
)(Feedback)
