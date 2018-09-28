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
import WithExternalLinks from '../hocs/WithExternalLinks'
// MUI
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Tabs, { Tab } from 'material-ui/Tabs'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'

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
  teamSelector
} from '../selectors/teamSelector'

import {
  issuesSelector
} from '../selectors/issuesSelector'

import {
  actionGetProject,
  actionGetSprints,
  actionStory,
  actionTeam,
  actionGetIssues
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
  tabs: {
    boxShadow: 'none !important'
  }
})

class Project extends Component {
  static propTypes = {
    fetching: PropTypes.bool,
    error: PropTypes.object,
    user: PropTypes.string
  }

  state = {
    activeTab: 0,
    reordering: false
  }

  componentDidMount () {
    const userToken = this.props.user
    const projectId = this.props.match.params.project_id
    this.props.loadStories(projectId)
    this.props.loadTeam(this.props.match.params)
    this.props.loadCurrentProject(userToken, projectId)
  }

  handleTabs = (event, value) => {
    this.setState({ activeTab: value })
  }

  handleRankFirst = (story) => {
    this.props.rankStoryFirst(story)
  }

  handleRankLast = (story) => {
    this.props.rankStoryLast(story)
  }

  handleRankBetween = (story, newList) => {
    let newIndex = newList.indexOf(story)
    let previousStory = newList[newIndex - 1].id
    let nextStory     = newList[newIndex + 1].id
    let data = {
      project_id: story.project_id,
      id: story.id,
      prev_story: previousStory,
      next_story: nextStory
    }
    this.props.rankStoryBetween(data)
  }

  onSortEnd = ({oldIndex, newIndex, collection}, _) => {
    if (oldIndex == newIndex)       { return }
    if (!this.props.currentProject) { return }
    const list = this.props.currentProject.backlog
    const newBacklog = arrayMove(list, oldIndex, newIndex)
    const lastIndex  = list.length - 1
    const firstIndex = 0
    if (newIndex === lastIndex) {
      this.handleRankLast(newBacklog[newIndex])
    } else if (newIndex === firstIndex) {
      this.handleRankFirst(newBacklog[newIndex])
    } else {
      this.handleRankBetween(newBacklog[newIndex], newBacklog)
    }
  }

  render () {
    const { currentProject, sprints, classes: { main, tabs } } = this.props
    return (
      <div>
        <AppBar position='static' className={tabs}>
          <Tabs value={this.state.activeTab} onChange={this.handleTabs} className={tabs}>
            <Tab label='Backlog' />
            <Tab label='All Stories' />
          </Tabs>
        </AppBar>
        <div className={main}>
          {this.state.activeTab === 2 &&
            <div>
              <Typography type='display1'>{currentProject.name} - Stories</Typography>
              <br />
              <StoriesTable data={this.props.stories} />
            </div>
          }
          {this.state.activeTab === 0 &&
            <div>
            <Typography type='display1'>{currentProject.name} - Backlog</Typography>
            <br />
            <StoriesSortableTable
              reordering={this.state.reordering}
              onSortEnd={this.onSortEnd}
              data={currentProject.backlog}
              handleRankFirst={this.handleRankFirst}
              handleRankLast={this.handleRankLast}
            />
            <FloatingLink path={`/app/projects/${this.props.match.params.project_id}/stories/new`} />
            </div>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  currentProject: currentProjectSelector(),
  user: userSelector(),
  loading: loadingSelector(),
  error: errorSelector(),
  team: teamSelector(),
  stories: issuesSelector()
})

function mapDispatchToProps (dispatch) {
  return {
    loadCurrentProject: (userToken, projectId) => dispatch(actionGetProject.request(userToken, projectId)),
    loadStories: (projectId)  => dispatch(actionGetIssues.request(projectId)),
    rankStoryFirst: (data)   => dispatch(actionStory.rankFirst(data)),
    rankStoryLast: (data)    => dispatch(actionStory.rankLast(data)),
    rankStoryBetween: (data) => dispatch(actionStory.rankBetween(data)),
    loadTeam: (data)         => dispatch(actionTeam.request(data)),
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  WithLoader,
  WithExternalLinks
)(Project)
