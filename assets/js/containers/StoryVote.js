import React, { Component } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import StoryDescription from '../components/stories/storyDescription'
import StoryVoteOptions from '../components/stories/storyVoteOptions'
import Sidebar from '../components/stories/sidebarVote'
import { Link } from 'react-router-dom'
import Markdown from 'react-markdown'
import { withRouter } from 'react-router-dom'
// MUI
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider'
import Snackbar from 'material-ui/Snackbar'
import Card, { CardContent } from 'material-ui/Card'
import KeyboardBackspace from 'material-ui-icons/KeyboardBackspace'

import {
  actionGetVotingIssue,
  actionResetVotingIssue,
  actionGetProject
} from '../actions'

import WithLoader from '../hocs/WithLoader'

import {
  loadingSelector,
  errorSelector,
  issueSelector
} from '../selectors/issueSelector'

import {
  entriesSelector
} from '../selectors/entriesSelector'

import {
  userSelector
} from '../selectors/userSelector'

import ChannelIssue from '../channels/issue'

const styles = theme => ({
  main: theme.mixins.gutters({
    width: '98%',
    maxWidth: 1200,
    margin: '0 auto',
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit
  }),
  title: {
    paddingTop:  theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  buttonGoBackStyle: {
    float: "right",
    color: "grey"
  },
  mainStory: theme.mixins.gutters({
    width: '70%',
    maxWidth: theme.palette.centeredColumn.maxWidth,
    float: 'left',
    display: 'flex',
    minHeight: 300
  }),
  styleChips: {
    width: '100%',
    display: 'flex'
  },
  storyDescription: {
    padding: theme.spacing.unit * 2
  }
})

const ShowNotification = (message, handleRequestClose) => {
  if (!message) { return "" }

  return (
    <Snackbar
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    open={true}
    autoHideDuration={4000}
    onRequestClose={handleRequestClose}
    SnackbarContentProps={{
      'aria-describedby': 'message-id',
    }}
    message={<span id="message-id">Vote received from {message.voter}.</span>}
    />
  )
}

class StoryVote extends Component {
  state = {
    issueId: this.props.match.params.issue_id,
    projectId: this.props.match.params.project_id,
    ws: new ChannelIssue(this.props.user.token, this.props.match.params.issue_id),
    notification: ""
  }

  componentDidMount () {
    this.props.loadShowVotingIssue(this.state)
    this.props.loadProject(null, this.props.match.params.project_id)
    ShowNotification("Somebody voted")
    this.state.ws.on('new_vote', vote => {
      this.setState({
        notification: vote
      })
      this.props.loadShowVotingIssue(this.state)
    })
  }

  componentWillUnmount () {
    this.props.resetStoreVotingIssue()
  }

  handleRequestClose = () => {
    this.setState({
      notification: false
    })
  }

  byCurrentIssue = issue => {
    return issue.list_id === this.state.sprintId
  }

  goToStory = (e) => {
    this.props.history.push(`/app/projects/${this.props.match.params.project_id}/stories/` + `${this.props.issue.id}`)
  }

  handleVote = ({id}) => {
    this.state.ws.push('new_vote', { entry_id: id })
  }

  render () {
    const { classes: { buttonGoBackStyle, main, title, card, mainStory, styleChips, storyDescription }, issue } = this.props
    if (!issue) { return <div /> }
    return (
      <div className={main}>
        {ShowNotification(this.state.notification, this.handleRequestClose)}
        <div className={mainStory}>
          {issue &&
            <Card raised={false}>
              <Typography  type="title" className="card-header">
                  {issue.title}
                  <Link className={buttonGoBackStyle} to={`/app/projects/${this.state.projectId}/stories/${this.state.issueId}`}>
                    <KeyboardBackspace className={buttonGoBackStyle}/>
                  </Link>
              </Typography>
              <CardContent className={styleChips}>
                <div>
                  <StoryVoteOptions
                    entries={issue.entries}
                    handleVote={this.handleVote} />
                </div>
              </CardContent>
              <Divider />
              <div className={storyDescription}>
                <Markdown source={issue.description} />
              </div>
            </Card>
          }

        </div>


        <Sidebar story={issue} goToStory={this.goToStory} />
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  loading: loadingSelector(),
  error: errorSelector(),
  entries: entriesSelector(),
  issue: issueSelector(),
  user: userSelector()
})

function mapDispatchToProps (dispatch) {
  return {
    loadShowVotingIssue: (data) => dispatch(actionGetVotingIssue.request(data)),
    resetStoreVotingIssue: () => dispatch(actionResetVotingIssue),
    loadProject: (user, project) =>  dispatch(actionGetProject.request(user, project))
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  WithLoader,
  withRouter
)(StoryVote)
