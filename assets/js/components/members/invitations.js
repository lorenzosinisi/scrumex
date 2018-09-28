import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { compose } from 'recompose'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import PersonOutline from 'material-ui-icons/PersonOutline'
import WorkIcon from 'material-ui-icons/Work'
import BeachAccessIcon from 'material-ui-icons/BeachAccess'
import Divider from 'material-ui/Divider'
import Delete from 'material-ui-icons/Delete'
import Button from 'material-ui/Button'

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 1200,
    margin: 'auto',
    backgroundColor: theme.palette.background.paper,
  },
  list: {
    width: '100%',
    margin: 'auto',
    maxWidth: 620,
  },
  remove: {
    cursor: 'pointer',
    'font-size': 12
  },
  button: {
    margin: theme.spacing.unit,
    opacity: 0.7
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 12
  },
})

const MemberInvitations = ({classes, members, handleDeleteMember}) => {
  if (members.length == 0) {
    return <div />
  }
  return (
    <div className={classes.root}>
    <div className={classes.list}>
      <strong>Invitations ({members.length})</strong>
      <List>
        {members.map(member => {
          return (
            <div key={member.email}>
            <ListItem>
              <Avatar>
                <PersonOutline />
              </Avatar>
              <ListItemText primary={member.email} secondary="invitation sent" />
              <Button  onClick={e => handleDeleteMember(member.email)} className={classes.button} variant="raised" color="secondary">
                revoke
                <Delete className={classes.rightIcon} />
              </Button>
            </ListItem>
            <li>
              <Divider inset />
            </li>
            </div>
          )
        })}
        </List>
      </div>
    </div>
  )
}

export default compose(
  withStyles(styles)
)(MemberInvitations)
