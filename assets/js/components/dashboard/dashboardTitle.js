import React, { Component } from 'react'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
// MUI
import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider'
import { withStyles } from 'material-ui/styles'

const styleSheet = theme => ({
  root: {
    margin: 20,
    'font-size': '22px',
    'text-align': 'left',
    'text-transform': 'uppercase',
    'margin-top': 30,
    'margin-bottom': 0
  },
  divider: {
    marginTop: 20
  }
})

class DashboardTitle extends Component {
  render () {
    const { classes, title } = this.props
    return (
      <div className={classes.root}>
      <Typography type='title' color='inherit'>
         {title}
      </Typography>
      <Divider className={classes.divider}/>
    </div>
    )
  }
}

export default compose(
  withRouter,
  withStyles(styleSheet)
)(DashboardTitle)
