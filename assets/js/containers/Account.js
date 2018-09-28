import React, { Component } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
// MUI
import { withStyles } from 'material-ui/styles'
import { withRouter } from 'react-router-dom'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button';
import WithLoader from '../hocs/WithLoader'
import WithExternalLinks from '../hocs/WithExternalLinks'

import {
  accountSelector,
  loadingSelector,
  errorSelector
} from '../selectors/accountSelector'



import {
  actionAccount,
  actionUser
} from '../actions'


const styles = theme => ({
  main: theme.mixins.gutters({
    width: '98%',
    margin: '0 auto',
    maxWidth: 1200,
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit
  }),
  title: {
    padding: theme.spacing.unit * 2,
    paddingLeft: 40
  },
  deleteAccount: {
    float: 'right'
  }
})

class Account extends Component {

  componentDidMount() {
    this.props.loadAccount()
  }

  handleSearch = (term) => {
    // this.props.loadSearchStories(term, this.props.match.params.project_id)
  }

  handleDeleteAccount = (e) => {
    let confirmation = confirm("Are you sure you want to delete your account?")
    if (confirmation == true) {
      this.props.deleteAccount()
    }
  }

  render() {
    const { classes, account } = this.props
    return <div>
        <Typography className={classes.title} type='display1'>Show account</Typography>

        <div className={classes.main}>
          <div><strong>Name</strong>: {account.email}</div>
          <div><strong>E-mail</strong>: {account.name}</div>
          <Button onClick={this.handleDeleteAccount} size="small" color="primary" className={classes.deleteAccount}>
             Delete account
          </Button>
        </div>
      </div>
  }
}


const mapStateToProps = createStructuredSelector({
  loading: loadingSelector(),
  error: errorSelector(),
  account: accountSelector()
})

function mapDispatchToProps (dispatch) {
  return {
    loadAccount: () =>  dispatch(actionAccount.request()),
    deleteAccount: () => dispatch(actionUser.deleteAccount())
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  WithLoader,
  withRouter,
  WithExternalLinks
)(Account)
