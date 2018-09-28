import React, { Component } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
// MUI
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  main: theme.mixins.gutters({
    width: '98%',
    margin: '0 auto',
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit
  })
})

class LoggedOut extends Component {
  render() {
    const { classes: { main }} = this.props
    return <div className={main}>
      Logged out successfully!
    </div>
  }
}


export default compose(
  connect(null, null),
  withStyles(styles)
)(LoggedOut)
