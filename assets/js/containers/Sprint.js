import React, { Component } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { findObjectByParam, prettyDate } from '../utils'
import { Link } from 'react-router-dom'
import StoriesTable from '../components/stories/storiesTable'
import BurnDownChart from '../components/sprints/BurnDownChart'
import FullWidthTabs  from '../components/sprints/filteredStories'
import AlertDialog from "../components/alertDialog"
import { withRouter } from 'react-router-dom'
// MUI
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Card from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import DoneIcon from 'material-ui-icons/Done'
import DeleteIcon from 'material-ui-icons/Delete'
import NoteAdd from 'material-ui-icons/NoteAdd'
import Flag from 'material-ui-icons/Flag'
import Create from 'material-ui-icons/Create'
import Label from 'material-ui-icons/Label'
import AppBar from 'material-ui/AppBar'
import Tabs, { Tab } from 'material-ui/Tabs'
import WithExternalLinks from '../hocs/WithExternalLinks'

import {
  actionGetIssues,
  actionDeleteSprint,
  actionSprint,
  actionGetProject,
  actionTeam
} from '../actions'

import WithLoader from '../hocs/WithLoader'

import {
  sprintSelector,
  loadingSelector,
  errorSelector
} from '../selectors/sprintSelector'

import {
  teamSelector
} from '../selectors/teamSelector'

import {
  userSelector
} from '../selectors/userSelector'

import {
  issuesSelector
} from '../selectors/issuesSelector'

import {
  burndownchartSelector
} from '../selectors/burndownchartSelector'

const styles = theme => ({
  main: theme.mixins.gutters({
    width: '98%',
    maxWidth: theme.palette.centeredColumn.maxWidth,
    margin: '0 auto',
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit
  }),
  buttonActive: {
    float: 'right',
    height: '30px',
    width: 'auto',
    marginRight: theme.spacing.unit,
    fontSize: 14,
    color: theme.palette.accent[500]
  },
  buttonInactive: {
    float: 'right',
    height: '30px',
    marginRight: theme.spacing.unit,
    width: 'auto',
    fontSize: 14,
  },
  buttonDelete: {
    float: 'right',
    height: '5px'
  },
  startsAt: {
    float: 'left'
  },
  dueDate: {
    float: 'right'
  },
  sprintDescription: {
    padding: theme.spacing.unit * 2
  },
  tabs: {
    boxShadow: 'none !important'
  }
})

class Sprint extends Component {
  state = {
    sprintId: this.props.match.params.sprint_id,
    projectId: this.props.match.params.project_id,
    deleteAlertOpen: false
  }

  resetResources = () => {
    this.props.resetSprint()
  }

  loadResources = () => {
    const projectId = this.props.match.params.project_id
    this.props.loadSprint(this.props.match.params)
    this.props.loadTeam(this.props.match.params)
    this.props.loadProject(null, this.props.match.params.project_id)
    this.props.loadIssues(projectId)
    this.props.loadBurndownchart(this.props.match.params)
  }

  componentWillMount() {
    this.resetResources()
  }
  componentDidMount() {
    this.loadResources()
  }
  componentWillUnmount() {
    this.resetResources()
  }

  byCurrentProject = issue => {
    return issue.list_id == this.props.match.params.sprint_id
  }

  byStoryDone = story => {
    return story.closed == true
  }

  byStoryOpen = story => {
    return story.closed != true
  }

  byStoryInProgress = story => {
    return story.closed == false && story.assignee_id !== null
  }

  byStoryNotAssigned = story => {
    return story.assignee_id == null
  }

  sortByPriority(a, b) {
    if (a.inserted_at < b.inserted_at) {
      return 1;
    }
    if (a.inserted_at > b.inserted_at) {
      return -1;
    }
    return 0;
  }

  stories() {
    return this.props.issues
      .filter(this.byCurrentProject)
      .sort(this.sortByPriority)
  }

  storiesDone() {
    return this.stories()
      .filter(this.byStoryDone)
      .sort(this.sortByPriority)
  }

  storiesInProgress() {
    return this.stories()
      .filter(this.byStoryInProgress)
      .sort(this.sortByPriority)
  }

  storiesDone() {
    return this.stories()
    .filter(this.byStoryDone)
    .sort(this.sortByPriority)
  }

  storiesOpen() {
    return this.stories()
      .filter(this.byStoryOpen)
      .filter(this.byStoryNotAssigned)
      .sort(this.sortByPriority)
  }

  handleDeleteSprint = e => {
    e.preventDefault()
    this.props.delete(this.state)
  }

  handleComplete = e => {
    e.preventDefault();
    this.props.complete(this.props.match.params);
  }

  handleClickOpenDeleteAlert = () => {
    this.setState({deleteAlertOpen: true})
  }

  handleRequestCloseDeleteAlert = () => {
    this.setState({deleteAlertOpen: false})
  }

  render() {
    const { sprint, team, burndownchart } = this.props

    if (!sprint.id) { return <div> </div> }

    if (sprint.type == 'backlog') {
      this.props.history.push(`/app/projects/${this.props.match.params.project_id}`)
      return <div />
    }

    const {
      classes: {
        main,
        buttonDelete,
        buttonActive,
        buttonInactive,
        startsAt,
        dueDate,
        sprintDescription,
        tabs
      }
    } = this.props;

    return <div>
        {sprint && (sprint.type != 'backlog') && <div className={main}>
            <div>

              <Typography type="title" className="card-header">
                {sprint.name}

                <IconButton className={buttonInactive} aria-label="Delete this sprint" onClick={this.handleClickOpenDeleteAlert}>
                  <DeleteIcon />
                  Delete
                </IconButton>

                <IconButton className={sprint.closed ? buttonActive : buttonInactive} aria-label="Mark this Sprint as complete" onClick={e => this.handleComplete(e)}>
                  <DoneIcon />
                  {sprint.closed ? "Re-open" : "Close"}
                </IconButton>
              </Typography>

              <AlertDialog handleRequestClose={this.handleRequestCloseDeleteAlert} question="Deleting a Sprint deletes also its contents. Please note that this action is permanent. Click YES to delete the Sprint" dangerousAction={this.handleDeleteSprint} open={this.state.deleteAlertOpen} />
            </div>
            <div className={sprintDescription}>
              <BurnDownChart data={burndownchart} />
              <div className={startsAt} />
              <div className={dueDate} />
            </div>
            <div>
              <FullWidthTabs
                sprintName={sprint.name}
                stories={this.stories()}
                storiesInProgress={this.storiesInProgress()}
                storiesDone={this.storiesDone()}
                storiesOpen={this.storiesOpen()}
                team={team}
              />
            </div>
          </div>}
      </div>;
  }
}

const mapStateToProps = createStructuredSelector({
  user: userSelector(),
  loading: loadingSelector(),
  error: errorSelector(),
  issues: issuesSelector(),
  sprint: sprintSelector(),
  burndownchart: burndownchartSelector(),
  team: teamSelector()
})

function mapDispatchToProps (dispatch) {
  return {
    loadIssues:  (projectId)     => dispatch(actionGetIssues.request(projectId)),
    delete:      (data)          => dispatch(actionDeleteSprint.request(data)),
    loadSprint:  (data)          => dispatch(actionSprint.request(data)),
    loadBurndownchart:  (data)   => dispatch(actionSprint.burndownchart(data)),
    resetSprint: ()              => dispatch(actionSprint.reset()),
    complete:    (data)          => dispatch(actionSprint.complete(data)),
    loadProject: (user, project) =>  dispatch(actionGetProject.request(user, project)),
    loadTeam: (data) => dispatch(actionTeam.request(data))
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  WithLoader,
  withRouter,
  WithExternalLinks
)(Sprint)
