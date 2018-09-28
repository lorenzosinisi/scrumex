import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Card from 'material-ui/Card'
import List, { ListItem, ListItemText } from 'material-ui/List'
import AssignmentInd from 'material-ui-icons/AssignmentInd'
import Bookmark from 'material-ui-icons/Bookmark'
import Divider from 'material-ui/Divider'
import DoneIcon from 'material-ui-icons/Done'
import Equalizer from 'material-ui-icons/Equalizer'
import TrendingDown from 'material-ui-icons/TrendingDown'
import Typography from 'material-ui/Typography'
import TextField from 'material-ui/TextField'
import _ from 'lodash'

const sprintById = (id, sprints) => {
  const sprint = _.find(sprints, sprint => {
    return sprint.id == id;
  });
  return sprint || { name: "Backlog" };
}

const styles = theme => ({
  root: {
    float: "right",
    width: "30%"
  },
  sidebarActionName: {
    padding: 10,
    opacity: 0.5,
    paddingBottom: 0
  },
  storyOptionEdit: {
    color: theme.palette.accent[500],
    backgroundColor: 'transparent',
    border: 'none',
    float: 'right',
    'text-decoration': 'none !important'
  },
  listItemStoryOption: {
    opacity: 0.8
  },
  listItemValue: {
    color: 'rgba(0, 0, 0, 0.87)'
  },
  menu: {
    width: '100%',
    padding: 10
  }
})

const sidebar = ({
  story,
  isWatching,
  toggleWatch,
  handleDone,
  handleAssignToMe,
  gotToVoteView,
  assignee,
  sprints,
  classes,
  gotToEditView,
  goToSprint,
  editSprintOpen,
  toggleEditSprint,
  handleChange,
  handleAssignToSprint,
  sprintId,
  watchers
  }) => {

  return (
    <Card className={classes.root}>
      <Typography type="title" className="card-header">
        Settings
      </Typography>
      <Typography color="textSecondary" className={classes.sidebarActionName}>
        Assignee
        <button className={classes.storyOptionEdit} onClick={e => handleAssignToMe(e)} >
          {story.assignee_id ? "remove" : "Assign to yourself"}
        </button>
      </Typography>
      <List component="nav">
        <ListItem>
          <AssignmentInd className={classes.listItemStoryOption} />
          <ListItemText className={classes.listItemStoryOption} primary={story.assignee_id ? assignee : "Not assigned"} />
        </ListItem>
        <Divider />
      </List>

      <Typography color="textSecondary" className={classes.sidebarActionName}>
        Status
        <button className={classes.storyOptionEdit} onClick={e => handleDone(e)}  >
          {story.closed ? "re-open" : "mark as done"}
        </button>
      </Typography>
      <List component="nav">
        <ListItem>
          <DoneIcon className={classes.listItemStoryOption} />
          <ListItemText className={classes.listItemStoryOption} primary={story.closed ? "Done" : "Open"} />
        </ListItem>
        <Divider />
      </List>


      <Typography color="textSecondary" className={classes.sidebarActionName}>
        Sprint
          {!editSprintOpen &&
              <button className={classes.storyOptionEdit} onClick={e => toggleEditSprint(e)}>
              edit
              </button>
          }
          {editSprintOpen &&
            <button className={classes.storyOptionEdit} onClick={e => handleAssignToSprint(e)}>
            save
          </button>
          }
      </Typography>
      <List component="nav">
        {!editSprintOpen && <ListItem button className={classes.listItemValue} onClick={e => goToSprint(e, story.list_id)}>
          <TrendingDown className={classes.listItemStoryOption} />
          <ListItemText className={classes.listItemStoryOption} primary={sprintById(story.list_id, sprints).name} />

        </ListItem>}

        {editSprintOpen && <div>
          <TextField
            id="select-sprint"
            select
            className={classes.menu}
            value={sprintId}
            onChange={handleChange('sprintId')}
            SelectProps={{
              native: true
            }}
            helperText="Please select an active sprint"
            margin="normal"
          >
            <option value=""> Backlog </option>
            {sprints.map(sprint => (
              <option key={sprint.id} value={sprint.id}>
                {sprint.name}
              </option>
            ))}
          </TextField>
        </div>}

        <Divider />
      </List>

      <Typography color="textSecondary" className={classes.sidebarActionName}>
        Story points
        <button className={classes.storyOptionEdit} onClick={e => gotToVoteView(e)} >
          vote
        </button>
      </Typography>
      <List component="nav">
        <ListItem className={classes.listItemValue}>
          <Equalizer className={classes.listItemStoryOption} />
          <ListItemText className={classes.listItemStoryOption} primary={`${story.story_points} story points`} />
        </ListItem>
        <Divider />
      </List>

      <Typography color="textSecondary" className={classes.sidebarActionName}>
        Notifications
        <button className={classes.storyOptionEdit} onClick={e => toggleWatch(e)}>
          {isWatching ? "turn off" : "turn on"}
        </button>
      </Typography>
      <List component="nav">
        <ListItem className={classes.listItemValue}>
          <Bookmark className={classes.listItemStoryOption} />
          <ListItemText className={classes.listItemStoryOption} primary={isWatching ? "Activated" : "Not active"} />

        </ListItem>
      </List>

      <Typography color="textSecondary" className={classes.sidebarActionName}>
        Watchers
      </Typography>
      <List component="nav">
          {
            watchers.map(user => { return (
              <div>
              <ListItem className={classes.listItemValue}>
                {user.name}
              </ListItem>
              </div>
            ) })
          }
      </List>
    </Card>
  )
}

export default  withStyles(styles)(sidebar)
