import React, { Component } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
import Markdown from 'react-markdown'
import AlertDialog from "../components/alertDialog"
import CommentsList from "../components/comments/list"
import StorySidebar from "../components/stories/sidebar"
import StoryMetadata from "../components/stories/storyMetadata"
import AttachmentsList from "../components/attachments/list"
import { prettyDateTime, TrimString } from "../utils"
import Dropzone from 'react-dropzone'
// MUI
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import Card from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui-icons/Delete'
import Button from 'material-ui/Button'
import Select from 'material-ui/Select'
import Input, { InputLabel } from 'material-ui/Input'
import TextField from 'material-ui/TextField'
import Divider from 'material-ui/Divider'
import Paper from 'material-ui/Paper'
import Create from 'material-ui-icons/Create'
import { MentionsInput, Mention } from 'react-mentions'

import {
  actionDeleteIssue,
  actionGetSprints,
  actionSetIssueToSprint,
  actionStory,
  actionresetSprints,
  actionresetStory,
  actionGetProject,
  actionTeam,
  actionComments,
  actionWatchers,
  actionAttachmentUploads
} from '../actions'

import WithLoader from '../hocs/WithLoader'
import WithExternalLinks from '../hocs/WithExternalLinks'

import {
  commentsSelector
} from '../selectors/commentsSelector'

import {
  attachmentsSelector
} from '../selectors/attachmentsSelector'

import {
  watchersSelector
} from '../selectors/watchersSelector'

import {
  loadingSelector,
  errorSelector,
  storySelector
} from '../selectors/storySelector'

import {
  sprintsSelector
} from '../selectors/sprintsSelector'

import {
  teamSelector
} from '../selectors/teamSelector'

import { userSelector } from "../selectors/userSelector"

const styles = theme => ({
  main: theme.mixins.gutters({
    width: '98%',
    maxWidth: 1200,
    margin: '0 auto',
    padding: 16,
    display: 'flex',
    marginTop: theme.spacing.unit
  }),
  mainStory: theme.mixins.gutters({
    width: '70%',
    maxWidth: theme.palette.centeredColumn.maxWidth,
    float: 'left'
  }),
  buttonDelete: {
    float: 'right',
    height: '30px',
    'font-size': theme.spacing.unit * 1.5,
    width: 'auto',
    marginRight: theme.spacing.unit
  },
  buttonActive: {
    float: 'right',
    height: '30px',
    color: theme.palette.accent[500],
    'font-size': theme.spacing.unit * 1.5,
    width: 'auto',
    marginRight: theme.spacing.unit
  },
  buttonInactive: {
    float: 'right',
    height: '30px',
    'font-size': theme.spacing.unit * 1.5,
    width: 'auto',
    marginRight: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    '@media(max-width: 540px)': {
      width: '100%'
    }
  },
  downloadLink: {
    color: theme.palette.a,
    '&:hover': {
      color: theme.palette.a,
    }
  },
  card: {
    display: 'flow-root',
  },
  content: {
    padding: theme.spacing.unit * 2
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },
  formAddToSprint: {
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4
  },
  sprintSelect: {
    'padding-left': theme.spacing.unit * 2
  },
  dropZoneStyle: {
    padding: "10px",
    width: "100%",
    height: "50px",
    "border-width": "2px",
    "border-color": "rgba(0, 0, 0, 0.54)",
    "color": "rgba(0, 0, 0, 0.54)",
    "border-style": "dashed",
    "border-radius": "5px",
    "margin-bottom": "20px"
  },
  assigneStyle: {
    "color": "rgba(0, 0, 0, 0.54)",
  },
  commentFormStyle: {
    "padding-left": "20px"
  },
  dropZoneContainerStyle: {
    padding: "10px"
  },
  textFieldClass: {
    'font-family': 'Arial, Helvetica, sans-serif !important',
  },
  formAddComment: {
    paddingLeft: "10px",
    paddingRight: "10px",
    width: '100%',
    minHeight: "167px"
  },
  textAreaComment: {
    width: '100%'
  },
  createCommentButton: {
    float: 'right',
    marginTop: 20,
    marginBottom: 20,
  }
})

class Story extends Component {
  assignee = () => {
    if (!this.props.team) {
      return;
    }
    if (!this.props.story) {
      return;
    }

    let assignedTo = _.find(this.props.team, member => {
      return member.id == this.props.story.assignee_id;
    });
    if (assignedTo) {
      return `Assigned to ${assignedTo.name}`;
    }
  };

  creator = () => {
    if (!this.props.team) {
      return;
    }
    if (!this.props.story) {
      return;
    }

    let creator = _.find(this.props.team, member => {
      return member.id == this.props.story.user_id;
    });
    if (creator) {
      return `${creator.name}`;
    }
  };

  transformTeamInMentions = () => {
    if (!this.props.team) {
      return [];
    }
    if (!this.props.story) {
      return [];
    }

    return _.map(this.props.team, member => {
      return {id: member.id, display: member.name};
    });
  }

  resetResources = () => {
    this.props.resetComments();
    this.props.resetSprints();
    this.props.resetStory();
  };

  loadResources = () => {
    this.props.loadSprints(this.props.match.params.project_id)
    this.props.loadProject(null, this.props.match.params.project_id)
    this.props.loadStory(this.props.match.params)
    this.props.loadTeam(this.props.match.params)
    this.props.loadComments(this.props.match.params)
    this.props.loadAttachments(this.props.match.params)
    this.props.getWatchers(this.props.match.params)
  };

  componentWillMount() {
    this.resetResources();
  }

  componentDidMount() {
    this.loadResources();
  }
  componentWillUnmount() {
    this.resetResources();
  }

  state = {
    ...this.props.match.params,
    sprintId: "",
    storyId: this.props.match.params.story_id,
    projectId: this.props.match.params.project_id,
    rightMenuOpen: false,
    deleteAlertOpen: false,
    editSprintOpen: false,
    body: "",
    comment_parent_id: null,
    reply_body: ""
  };

  componentWillReceiveProps(nextProps) {
    let { story: { list_id } } = nextProps
    this.setState({sprintId: list_id})
  }

  sprint(story) {
    let currentSprint;
    if (story) {
      currentSprint = _.find(this.props.sprints, sprint => {
        return sprint.id === story.list_id;
      });
    }
    return currentSprint;
  }

  toggleRightMenu = () => {
    this.setState({
      rightMenuOpen: !this.state.rightMenuOpen
    });
  };

  handleDelete = e => {
    e.preventDefault();
    this.props.delete(this.state);
  };

  handleDone = e => {
    e.preventDefault();
    this.props.markAsDone(this.props.match.params);
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleAssignToSprint = e => {
    e.preventDefault();
    this.props.assignToSprint(this.state);
    this.props.loadStory(this.props.match.params);
    this.toggleEditSprint(e)
  };

  handleAssignToMe = () => {
    this.props.assignToMe(this.props.match.params);
  };

  handleClickOpenDeleteAlert = () => {
    this.setState({ deleteAlertOpen: true });
  };

  handleRequestCloseDeleteAlert = () => {
    this.setState({ deleteAlertOpen: false });
  };

  handleCreateComment = e => {
    e.preventDefault();
    this.props.createComment(this.state);
    this.setState({ body: "", comment_parent_id: null });
  };

  handleCreateReply = e => {
    e.preventDefault();
    this.props.createComment({project_id: this.state.project_id, story_id: this.state.story_id, body: this.state.reply_body, comment_parent_id: this.state.comment_parent_id});
    this.setState({ reply_body: "", comment_parent_id: null });
  };

  handleChangeComment = event => {
    this.setState({ body: event.target.value, comment_parent_id: null });
  };

  handleChangeReply = event => {
    this.setState({ reply_body: event.target.value });
  };

  handleDeleteComment = (comment, _b) => {
    this.props.deleteComment(this.state, comment.id)
  }

  handleReplyComment = (comment, b) => {
    this.setState({ comment_parent_id: comment.id});
  }

  handleDeleteAttachment = (attachment, _b) => {
    let confirmation = confirm("Are you sure you want to delete " + attachment.name + "?")
    if (confirmation == true) {
        this.props.deleteAttachment(this.state, attachment.id)
    }
  }

  handleWatch = (e) => {
    this.props.watch(this.state)
  }

  handleUnwatch = (e) => {
    this.props.unwatch(this.state)
  }

  isWatching = (e) => {
    if (this.props.watchers.length == 0) {
      return false
    }
    return _.find(this.props.watchers, watcher => {
      return this.props.user && watcher.id == this.props.user.id
    })
  }

  filterActiveSprints(sprints) {
    return _.filter(sprints, sprint => {
      return sprint.closed !== true
    })
  }

  gotToEditView = (id) => {
    this.props.history.push(`./` + `${this.props.match.params.story_id}` + '/edit')
  }

  toggleEditSprint = (event) => {
    this.setState({
      editSprintOpen: !this.state.editSprintOpen
    });
  }

  sortByDate(a, b) {
    if (a.inserted_at > b.inserted_at) {
      return 1;
    }
    if (a.inserted_at < b.inserted_at) {
      return -1;
    }
    return 0;
  }

  gotToVoteView = (id) => {
    this.props.history.push(`./` + `${this.props.match.params.story_id}` + '/vote')
  }

  goToSprint = (e, sprint_id) => {
    const sprint = _.find(this.props.sprints, sprint => {
      return sprint.id == sprint_id
    })
    if (!sprint_id) {
      return
    } else {
      this.props.history.push(`/app/projects/${this.props.match.params.project_id}/sprints/` + `${sprint_id}`)
    }
  }

  toggleWatch = (e) => {
    this.isWatching(e) ? this.handleUnwatch(e) : this.handleWatch(e)
  }

  onImageDrop = (acceptedFiles, rejectedFiles) => {
    acceptedFiles.forEach(file => {
      const data = Object.assign(this.state, {file: file});
      this.props.uploadAttachment(data)
    })
  }

  render() {
    let story = this.props.story
    let sprint = this.sprint(story)
    let attachments = this.props.attachments

    const {
      sprints,
      classes: {
        buttonDelete,
        buttonActive,
        buttonInactive,
        button,
        formAddToSprint,
        sprintSelect,
        markdown,
        main,
        textFieldClass,
        content,
        card,
        singleComment,
        formAddComment,
        textAreaComment,
        createCommentButton,
        dropZoneStyle,
        dropZoneContainerStyle,
        assigneStyle,
        downloadLink,
        mainStory
      }
    } = this.props;

    let { body } = this.state

    const activeSprints = this.filterActiveSprints(sprints)
    return (
      <div>
        <AlertDialog
          handleRequestClose={this.handleRequestCloseDeleteAlert}
          question="Deleting a Story is a permanent action. Click YES to proceed with the deletion."
          dangerousAction={this.handleDelete}
          open={this.state.deleteAlertOpen}
        />
        <div className={main}>
          <div className={mainStory}>
          {
            <Card className={card}>
              <Typography type="title" className="card-header">
                {TrimString(story.title, 40)}
                <IconButton
                  className={buttonInactive}
                  aria-label="Edit this Story"
                  onClick={e => this.gotToEditView(e)}
                >
                  <Create />
                  Edit
                </IconButton>

                <IconButton
                  className={buttonDelete}
                  aria-label="Delete"
                  onClick={this.handleClickOpenDeleteAlert}
                >
                  <DeleteIcon />
                  Delete
                </IconButton>
              </Typography>
              <div className={content}>
                {story.description && (
                  <Markdown className={markdown} source={story.description} />
                )}
              </div>
              <div className={dropZoneContainerStyle}>
                <Dropzone
                  className={dropZoneStyle}
                  multiple={false}
                  accept="image/*"
                  onDrop={this.onImageDrop.bind(this)}>
                  <p>Drop an image or click to select a file to upload.</p>
                </Dropzone>
              </div>

              <AttachmentsList attachments={attachments} handleDeleteAttachment={this.handleDeleteAttachment} />
              <Divider />
              <StoryMetadata creator={this.creator()} updatedAt={story.updated_at} />
            </Card>
          }
          <br />
          <Card className={card}>
            <Typography type="title" className="card-header">
              Comments
            </Typography>

            <CommentsList
              comments={this.props.comments.sort(this.sortByDate)}
              sortByDate={this.sortByDate}
              handleDeleteComment={this.handleDeleteComment}
              handleReplyComment={this.handleReplyComment}
              handleCreateReply={this.handleCreateReply}
              handleChangeReply={this.handleChangeReply}
              comment_parent_id={this.state.comment_parent_id}
              reply_body={this.state.reply_body}
              userId={this.props.user.id}
              team={this.props.team}
            />

            <form
              className={formAddComment}
              onSubmit={e => this.handleCreateComment(e)}
            >
              <Grid container spacing={24}>
                <Grid item xs={12}>
                <MentionsInput
                  allowSpaceInQuery={true}
                  style={{
                      border: 'none',
                      borderBottom: 20,
                      '&:focus': {
                          outline: 'none'
                      },
                      input: {
                        padding: 10,
                        minHeight: 200,
                        outline: 0,
                        border: '1px solid rgba(0, 0, 0, 0.12)'
                        },
                        suggestions: {
                          list: {
                            backgroundColor: 'white',
                            'font-family': 'Arial, Helvetica, sans-serif !important',
                            border: '1px solid #0094c06b',
                            fontSize: 14,
                          },

                          item: {
                            padding: '5px 15px',
                            'font-family': 'Arial, Helvetica, sans-serif !important',
                            borderBottom: '0px',

                            '&focused': {
                              backgroundColor: '#0094c0',
                              color: 'white'
                            },
                          },
                        },
                      }}
                  value={this.state.body}
                  onChange={e => this.handleChangeComment(e, "body")}
                  >
                  <Mention
                    appendSpaceOnAdd={true}
                    label="Leave a comment"
                    trigger="@"
                    data={this.transformTeamInMentions()}
                  />
                </MentionsInput>
                </Grid>
              </Grid>
              <Button
                raised
                id="multiline-flexible"
                disabled={this.state.body.length < 1}
                color="primary"
                multiline
                rowsMax="4"
                type="submit"
                className={createCommentButton}
              >
                Comment
              </Button>
            </form>
          </Card>
          </div>

          <StorySidebar
            handleAssignToMe={this.handleAssignToMe}
            story={story}
            sprintId={this.state.sprintId}
            handleDone={this.handleDone}
            handleChange={this.handleChange}
            editSprintOpen={this.state.editSprintOpen}
            toggleEditSprint={this.toggleEditSprint}
            handleAssignToSprint={this.handleAssignToSprint}
            gotToVoteView={this.gotToVoteView}
            toggleWatch={this.toggleWatch}
            isWatching={this.isWatching()}
            assignee={this.assignee()}
            watchers={this.props.watchers}
            sprints={this.props.sprints}
            gotToEditView={this.gotToEditView}
            goToSprint={this.goToSprint}
          />
        </div>
      </div>
    )
  }

}

const mapStateToProps = createStructuredSelector({
  loading: loadingSelector(),
  error:   errorSelector(),
  story:   storySelector(),
  sprints: sprintsSelector(),
  team:    teamSelector(),
  comments: commentsSelector(),
  attachments: attachmentsSelector(),
  watchers: watchersSelector(),
  user: userSelector()
})

function mapDispatchToProps (dispatch) {
  return {
    delete: (id, data)       =>  dispatch(actionDeleteIssue.request(id, data)),
    loadSprints: (projectId) =>  dispatch(actionGetSprints.request(projectId)),
    resetSprints: ()         =>  dispatch(actionresetSprints),
    assignToSprint: (data)   =>  dispatch(actionStory.addToSprint(data)),
    loadStory: (data)        =>  dispatch(actionStory.request(data)),
    markAsDone: (data)       =>  dispatch(actionStory.complete(data)),
    resetStory: ()           =>  dispatch(actionresetStory),
    assignToMe: (data)       =>  dispatch(actionStory.assignToMe(data)),
    loadTeam: (data)         =>  dispatch(actionTeam.request(data)),
    loadProject: (user, project)      =>  dispatch(actionGetProject.request(user, project)),
    loadComments: (data) => dispatch(actionComments.request(data)),
    loadAttachments: (data) => dispatch(actionAttachmentUploads.request(data)),
    resetComments: (data) => dispatch(actionComments.reset(data)),
    createComment: (data) => dispatch(actionComments.create(data)),
    deleteComment: (data, id) => dispatch(actionComments.delete(data, id)),
    deleteAttachment: (data, id) => dispatch(actionAttachmentUploads.delete(data, id)),
    watch: (data) => dispatch(actionWatchers.watch(data)),
    unwatch: (data) => dispatch(actionWatchers.unwatch(data)),
    getWatchers: (data) => dispatch(actionWatchers.request(data)),
    uploadAttachment: (data) => dispatch(actionAttachmentUploads.create(data))
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  WithExternalLinks,
  WithLoader
)(Story)
