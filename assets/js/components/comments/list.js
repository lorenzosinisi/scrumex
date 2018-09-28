import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
import { withStyles } from 'material-ui/styles'
import _ from 'lodash'
import { prettyDateTime } from "../../utils"
import Markdown from 'react-markdown'

// MUI
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui-icons/Delete'
import Divider from 'material-ui/Divider'
import ReplyIcon from 'material-ui-icons/Reply'
import Grid from 'material-ui/Grid'
import Card from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'

const styles = theme => ({
  commentListStyle: {
    "padding": "10px"
  },
  singleComment: {
    padding: theme.spacing.unit
  },
  commentBody: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  commentListStyle: {
    "padding": "10px"
  },
  metadata: {
    opacity: theme.palette.metadata.opacity
  },
  buttonDelete: {
    float: 'right',
    height: '30px',
    'font-size': theme.spacing.unit * 1.5,
    width: 'auto',
    marginRight: theme.spacing.unit
  },
  buttonReply: {
    float: 'right',
    height: '30px',
    'font-size': theme.spacing.unit * 1.5,
    width: 'auto',
    marginRight: theme.spacing.unit
  },
  formAddComment: {
    paddingLeft: 100
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
    float: 'right'
  }
})

const userById = (id, team) => {
  const commentator = _.find(team, member => {
    return member.id == id;
  });
  return commentator || { name: "Anonymous" };
}
const CommentsReplies = ({parent, comments, handleDeleteComment, handleReplyComment, sortByDate, team, userId, classes }) => {
  return (
    <div className={classes.commentListStyle}>
    {
      comments.map(comment => { return (
          <div key={comment.id}>
          <Divider />
          <Paper className={classes.singleComment} elevation={0}>
            <Typography className={classes.metadata}>
              {userById(comment.user_id, team).name} -{" "}
              {prettyDateTime(comment.inserted_at)}
              {
                userId == comment.user_id &&
                  <IconButton
                  className={classes.buttonDelete}
                  aria-label="Delete"
                  onClick={handleDeleteComment.bind(this, comment)}
                >
                  <DeleteIcon />
                  Delete
                </IconButton>
              }

              <IconButton
              className={classes.buttonReply}
              aria-label="Reply"
              onClick={handleReplyComment.bind(parent, parent)}
            >
              <ReplyIcon />
              Reply
            </IconButton>
            </Typography>
            <div className={classes.commentBody}>
              <Markdown source={comment.body} />
            </div>
          </Paper>
          </div>
        )}
      )
    }
    </div>
  )
}

const CommentsList = ({comments, handleDeleteComment, reply_body, sortByDate, comment_parent_id, handleChangeReply, handleReplyComment, handleCreateReply, team, userId, classes }) => {
  return (
    <div className={classes.commentListStyle}>
    {
      comments.map(comment => { return (

          <div key={comment.id}>
          <Paper className={classes.singleComment} elevation={0}>
            <Typography className={classes.metadata}>
              {userById(comment.user_id, team).name} -{" "}
              {prettyDateTime(comment.inserted_at)}
              {
                userId == comment.user_id &&
                  <IconButton
                  className={classes.buttonDelete}
                  aria-label="Delete"
                  onClick={handleDeleteComment.bind(this, comment)}
                >
                  <DeleteIcon />
                  Delete
                </IconButton>
              }

              <IconButton
              className={classes.buttonReply}
              aria-label="Reply"
              onClick={handleReplyComment.bind(this, comment)}
            >
              <ReplyIcon />
              Reply
            </IconButton>

            </Typography>
            <div className={classes.commentBody}>
              <Markdown source={comment.body} />
            </div>

            <CommentsReplies parent={comment} comments={comment.replies.sort(sortByDate)} handleDeleteComment={handleDeleteComment} handleReplyComment={handleReplyComment} team={team} userId={userId} classes={classes} />

            {comment.id === comment_parent_id && comment_parent_id && (
              <form
                className={classes.formAddComment}
                onSubmit={e => handleCreateReply(e)}
              >
                <Grid container spacing={24}>
                  <Grid item xs={12}>
                  <TextField
                      label="Leave a reply"
                      autoFocus={true}
                      placeholder=""
                      value={reply_body}
                      InputProps={{
                        classes: {
                          root: classes.textFieldClass,
                          input: classes.textFieldClass,
                        },
                      }}
                      InputLabelProps={{
                        className: classes.textFieldClass,
                      }}
                      multiline
                      className={classes.textAreaComment}
                      margin="normal"
                      onChange={e => handleChangeReply(e)}
                    />
                  </Grid>
                </Grid>
                <Button
                  raised
                  id="multiline-flexible"
                  disabled={reply_body < 1}
                  color="primary"
                  multiline
                  rowsMax="4"
                  type="submit"
                  className={classes.createCommentButton}
                >
                  Reply
                </Button>
              </form>
            )}
          </Paper>

          <Divider />
          </div>
        )}
      )
    }
    </div>
  )
}

export default compose(
  withStyles(styles)
)(CommentsList)
