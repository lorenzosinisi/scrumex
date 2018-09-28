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
  })
})

class Sprints extends Component {
  componentDidMount () {
    const userToken = this.props.user
    const projectId = this.props.match.params.project_id
    this.props.loadSprints(projectId)
    this.props.loadCurrentProject(userToken, projectId)
  }

  render () {
    const { currentProject, sprints, classes: { main, tabs } } = this.props
    return (
      <div>
        <div className={main}>
          <Typography type='display1'>{currentProject.name} - Sprints</Typography>
          <br />
          <SprintsTable data={sprints} />
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
