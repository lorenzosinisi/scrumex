import React, { Component } from 'react'
import { compose } from 'recompose'
import { withStyles } from 'material-ui/styles'
import { withRouter, Link } from 'react-router-dom'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import ExitToApp from 'material-ui-icons/ExitToApp'
import Search from 'material-ui-icons/Search'
import Dashboard from 'material-ui-icons/Dashboard'
import { CONFIGURATION } from '../../config/index'
import NavigationMain from './navigationMain'

const styleSheet = theme => ({
  primaryColor: {
    background: theme.palette.primary[700],
    color: '#fff',
    boxShadow: 'none'
  },
  backButton: {
    flex: 'none',
    float: 'right'
  },
  flex: {
    flex: 1
  },
  linkSearch: {
    color: '#fff',
    'font-size': 14
  },
  linkSearchIcon: {
    color: '#fff',
    'font-size': 14
  }
})

class NavigationTop extends Component {
  state = {
    open: false
  }

  toggleDrawer = (open) => {
    this.setState({ open })
  }

  handleOpen  = () => this.toggleDrawer(true)
  handleClose = () => this.toggleDrawer(false)

  render () {
    const { classes: { linkSearchIcon, linkSearch, primaryColor, backButton, flex }, route, logOutAction, project } = this.props
    return (
      <div>
        <AppBar position='static' className={primaryColor}>
          <Toolbar>
            <IconButton
              onClick={this.handleOpen}
              color='contrast'
              aria-label='Menu'
            >
              <MenuIcon />
            </IconButton>
            <Typography type='title' color='inherit' className={flex}>
               <span class="logo-white"> </span>
            </Typography>
            {project.id && <Link to={`/app/projects/${project.id}/dashboard`}>
              <ListItem button>
                <ListItemIcon>
                    <Dashboard className={linkSearchIcon} />
                </ListItemIcon>
                <span className={linkSearch}> {project.name}</span>
              </ListItem>
            </Link>}

            {project.id && <Link to={`/app/projects/${project.id}/search`}>
              <ListItem button>
                <ListItemIcon>
                    <Search className={linkSearchIcon} />
                </ListItemIcon>
                <span className={linkSearch}> Search</span>
              </ListItem>
            </Link>}

          </Toolbar>
        </AppBar>
        <NavigationMain
          project={this.props.project}
          sprint={this.props.sprint}
          story={this.props.story}
          isOpen={this.state.open}
          onRequestClose={this.handleClose}
          onClick={this.handleClose}
          logOutAction={logOutAction}
        />
      </div>
    )
  }
}

export default compose(
  withRouter,
  withStyles(styleSheet)
)(NavigationTop)
