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
    float: 'right',
    'text-decoration': 'none !important'
  },
  listItemStoryOption: {
    opacity: 0.8
  },
  listItemValue: {
    color: 'rgba(0, 0, 0, 0.87)'
  }
})

const sidebarVote = ({classes, story, goToStory}) => {

  return (
    <Card className={classes.root}>
      <Typography type="title" className="card-header">
        Consensus
      </Typography>

      <Typography color="textSecondary" className={classes.sidebarActionName}>
        Story points
      </Typography>
      <List component="nav">
        <ListItem className={classes.listItemValue}>
          <Equalizer className={classes.listItemStoryOption} />
          <ListItemText className={classes.listItemStoryOption} primary={`${story.story_points} story points`} />
        </ListItem>
        <Divider />
      </List>

      <Typography color="textSecondary" className={classes.sidebarActionName}>
        Story
      </Typography>
      <List component="nav">
        <ListItem button className={classes.listItemValue} onClick={(e) => goToStory(e)}>
          <ListItemText className={classes.listItemStoryOption} primary={`"${story.title}"`} />
        </ListItem>
        <Divider />
      </List>

      <Typography color="textSecondary" className={classes.sidebarActionName}>
        How it works
      </Typography>
      <List component="nav">
        <ListItem className={classes.listItemValue}>
          <ListItemText className={classes.listItemStoryOption} primary={`
            Selecting one of the chips on the left side will submit and save your personal vote for this story.
            They represent the complexity of the story in relation to time, risk of something going wrong and the level of uncertanty.
            The story points will favor the most conservative team member (the highest vote received).
            `} />
        </ListItem>
        <Divider />
      </List>

      <Typography color="textSecondary" className={classes.sidebarActionName}>
        Knowledge sharing
      </Typography>
      <List component="nav">
        <ListItem className={classes.listItemValue}>
          <ListItemText className={classes.listItemStoryOption} primary={`
            If you think that the story points are not representative of reality, try to convince your team members to change idea and give a new vote to this story.
            `} />
        </ListItem>
      </List>
    </Card>
  )
}

export default withStyles(styles)(sidebarVote)
