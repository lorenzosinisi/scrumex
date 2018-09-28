import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { withStyles } from 'material-ui/styles'
import { Link } from 'react-router-dom'
import _ from 'lodash'

// MUI
import Card, { CardContent } from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import Equalizer from 'material-ui-icons/Equalizer'

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto'
  },
  table: {
    width: '100%'
  },
  link: {
    color: theme.palette.a,
    '&:hover': {
      color: theme.palette.a,
    },
    'font-weight': '500'
  },
  singleStory: {
    boxShadow: 'none',
    borderBottom: theme.palette.divider
  },
  rightItem: {
    float: 'right',
    marginRight: theme.spacing.unit * 2
  },
  iconInfo: {
    fontSize: theme.spacing.unit * 2,
    height: 'auto'
  }
})

const assigneeName = (team, story) => {
  let assignee = _.find(team, (member) => {
    return member.id == story.assignee_id
  })
  if (assignee) {
    return `Assigned to ${assignee.name}`
  }
  return ''
}

const StoriesTable = ({ classes, data, team }) => {
  const { table, root, rightItem, singleStory } = classes;
  return (
    <div className={root}>
      {
        data.map((value, index) => (
          <Card key={index} className={singleStory}>
            <CardContent>
               <Link className={classes.link} to={`/app/projects/${value.project_id}/stories/${value.id}`} title='view story'>
                 <span className={classes.link}> {value.title}</span>
               </Link>
               <span className={classes.rightItem}>
                <Link to={`/app/projects/${value.project_id}/stories/${value.id}/vote`} title='view story'>
                  <IconButton className={classes.iconInfo} icon={<Equalizer/>} label="Story Points"> <Equalizer /> {value.story_points} </IconButton>
                </Link>
                </span>
                <span className={classes.rightItem}>
                  { assigneeName(team, value) }
                </span>
                <span className={classes.rightItem}>
                  {value.closed ? "Closed" : "Open"}
                </span>
            </CardContent>
          </Card>
        ))
      }
    </div>
  )
}

StoriesTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array
}

export default compose(
  withRouter,
  withStyles(styles)
)(StoriesTable)
