import React, { Component }  from 'react'
import { withRouter, Link } from 'react-router-dom'
import { compose } from 'recompose'
import { withStyles } from 'material-ui/styles'
import Drawer from 'material-ui/Drawer'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import IconButton from 'material-ui/IconButton'
import ChevronLefttIcon from 'material-ui-icons/ChevronLeft'
import ListIcon from 'material-ui-icons/FormatListNumbered'
import Label from 'material-ui-icons/Label'
import Create from 'material-ui-icons/Create'
import People from 'material-ui-icons/People'
import Star from 'material-ui-icons/Star'
import Search from 'material-ui-icons/Search'
import Home from 'material-ui-icons/Inbox'
import Dashboard from 'material-ui-icons/Dashboard'
import ExitToApp from 'material-ui-icons/ExitToApp'
import Poll from 'material-ui-icons/Poll'
import GroupWork from 'material-ui-icons/GroupWork'
import Work from 'material-ui-icons/Work'
import NewIcon from 'material-ui-icons/FiberNew'
import ExpandLess from 'material-ui-icons/ExpandLess'
import ExpandMore from 'material-ui-icons/ExpandMore'
import Feedback from 'material-ui-icons/Feedback'
import ListSubheader from 'material-ui/List/ListSubheader';
import Collapse from 'material-ui/transitions/Collapse';
import { TrimString } from "../../utils"

const styleSheet = theme => ({
  list: {
    position: 'relative',
    width: theme.spacing.unit * 40,
    height: '100%',
    flex: 'initial',
    '& a': {
      '&:hover': {
        textDecoration: 'none'
      }
    }
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  bottom: {
    position: 'fixed',
    bottom: 0,
    width: '100%'
  }
})

class ProjectMenu extends Component {
  state = { projectMenuOpen: false }

  handleClickOpen = () => {
    this.setState({ projectMenuOpen: !this.state.projectMenuOpen })
  }

  render() {
    const { classes, project } = this.props
    return (
      <div>
      <Divider />
      <List className={classes.root}>
        <Link to={`/app/projects/${project.id}/dashboard`}>
          <ListItem button>
            <ListItemIcon>
             <Dashboard />
            </ListItemIcon>
            <ListItemText primary={project.name} />
          </ListItem>
        </Link>
        <Link to={`/app/projects/${project.id}`}>
          <ListItem button>
            <ListItemIcon>
             <Home />
            </ListItemIcon>
            <ListItemText primary={"Backlog"} />
          </ListItem>
        </Link>
        <Link to={`/app/projects/${project.id}/sprints`}>
          <ListItem button>
            <ListItemIcon>
             <GroupWork />
            </ListItemIcon>
            <ListItemText primary={"Sprints"} />
          </ListItem>
        </Link>
      </List>
      </div>
    )
  }
}

const NavigationMain = ({ isOpen, onRequestClose, onClick, classes, project, sprint, story, logOutAction, user }) => {
  const { list, drawerHeader } = classes

  return (
    <Drawer
      onClick={onClick}
      open={isOpen}
      onRequestClose={onRequestClose}
    >
      <div className={list}>
        <div className={drawerHeader}>
          <IconButton onClick={onClick}>
            <ChevronLefttIcon />
          </IconButton>
        </div>
        {
          project.id &&
          <div>
            <ProjectMenu classes={classes} project={project} sprints={project.active_sprints} />
            <Link to={`/app/projects/${project.id}/search`}>
              <ListItem button>
                <ListItemIcon>
                    <Search />
                </ListItemIcon>
                <ListItemText primary="Search" />
              </ListItem>
            </Link>
            <Link to={`/app/projects/${project.id}/sprints/new`}>
              <ListItem button>
                <ListItemIcon>
                    <Create />
                </ListItemIcon>
                <ListItemText primary="New Sprint" />
              </ListItem>
            </Link>
            <Link to={`/app/projects/${project.id}/stories/new`}>
              <ListItem button>
                <ListItemIcon>
                    <Create />
                </ListItemIcon>
                <ListItemText primary="New Story" />
                </ListItem>
            </Link>
            {user.id == project.user_id, <Link to={`/app/projects/${project.id}/members`}>
              <ListItem button>
                <ListItemIcon>
                    <People />
                </ListItemIcon>
                <ListItemText primary="Team" />
                </ListItem>
            </Link>}
            <Divider />
          </div>
        }
        {
          <div>
          <List disablePadding>
          <Link to='/app/projects'>
            <ListItem button>
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText primary='Projects' />
            </ListItem>
          </Link>
          <Link to='/app/projects/new'>
            <ListItem button>
              <ListItemIcon>
                <NewIcon />
              </ListItemIcon>
              <ListItemText primary='New Project' />
            </ListItem>
          </Link>
          <Divider />
            <div onClick={logOutAction} className={classes.bottom}>
              <ListItem button>
                <ListItemIcon>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText primary='Logout' />
              </ListItem>
            </div>
          </List>
          </div>
        }
      </div>
    </Drawer>
  )
}

export default compose(
  withRouter,
  withStyles(styleSheet)
)(NavigationMain)
