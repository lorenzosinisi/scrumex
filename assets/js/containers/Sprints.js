import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import StoriesTable from '../components/stories/storiesTable'
import StoriesSortableTable from '../components/stories/storiesSortableTable'
import SprintsTable from '../components/sprints/SprintsTable'
import { arrayMove } from 'react-sortable-hoc'
import FloatingLink from '../components/buttons/floating'
import { Link } from 'react-router-dom'
// MUI
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Tabs, { Tab } from 'material-ui/Tabs'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import WithExternalLinks from '../hocs/WithExternalLinks'

import {
  currentProjectSelector,
  loadingSelector,
  errorSelector
} from '../selectors/showProjectSelector'

import {
  sprintsSelector
} from '../selectors/sprintsSelector'

import {
  userSelector
} from '../selectors/userSelector'

import {
  actionGetProject,
  actionGetSprints
} from '../actions'

import WithLoader from '../hocs/WithLoader'

const styles = theme => ({
  main: theme.mixins.gutters({
    width: '98%',
    margin: '0 auto',
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit
  }),
  dashedDiv: {
    color: 'rgba(0, 0, 0, 0.54)',
    padding: 10,
    'border-width': 2,
    'border-color': 'rgba(0, 0, 0, 0.54)',
    'border-style': 'dashed',
    'border-radius': 5,
    margin: 20,
    marginLeft: 0,
  }
})

class Sprints extends Component {
  componentDidMount () {
    const userToken = this.props.user
    const projectId = this.props.match.params.project_id
    this.props.loadSprints(projectId)
    this.props.loadCurrentProject(userToken, projectId)
  }

  isEmpty() {
    return this.props.loading == false
      && this.props.sprints
      && this.props.sprints.length == 0
  }

  render () {
    const { currentProject, sprints, classes: { main, tabs, dashedDiv } } = this.props
    return (
      <div>
        <div className={main}>
          <Typography type='display1'>{currentProject.name} - Sprints</Typography>
          <br />
          {this.isEmpty() == true ?
            <div className={dashedDiv}>As described in the Scrum Guide, a Sprint, a time-box of one month or less during which a “Done”, useable, and Scrum Sprint is part of the Empirical Processpotentially releasable product Increment is created. Sprints have consistent durations throughout a development effort. A new Sprint starts immediately after the conclusion of the previous Sprint. <br /> Click <Link to={`/app/projects/${currentProject.id}/sprints/new`}> here </Link> to create a new one.</div> : <SprintsTable data={sprints} /> }
          <FloatingLink path={`/app/projects/${this.props.match.params.project_id}/sprints/new`} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  currentProject: currentProjectSelector(),
  sprints: sprintsSelector(),
  user: userSelector(),
  loading: loadingSelector(),
  error: errorSelector()
})

function mapDispatchToProps (dispatch) {
  return {
    loadCurrentProject: (userToken, projectId) => dispatch(actionGetProject.request(userToken, projectId)),
    loadSprints: (projectId) => dispatch(actionGetSprints.request(projectId)),
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  WithLoader,
  WithExternalLinks
)(Sprints)
