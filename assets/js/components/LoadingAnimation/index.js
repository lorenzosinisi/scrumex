import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { CircularProgress } from 'material-ui/Progress'

import Button from 'material-ui/Button'
import Snackbar from 'material-ui/Snackbar'


const styles = theme => ({
  loadingAimation: {
    background: 'rgba(0,0,0,0.7)',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 99999
  },
  loaderIcon: {
    position: 'absolute',
    left: '50%',
    top: '50%'
  }
})

const LoadingAnimation = (props) => {
  const { classes: { loadingAimation, loaderIcon }, loading } = props
  return (
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={loading}
        SnackbarContentProps={{
          'aria-describedby': 'loading',
        }}
        message={<span id="message-id">loading...</span>}
      />
  )
}

LoadingAnimation.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(LoadingAnimation)
