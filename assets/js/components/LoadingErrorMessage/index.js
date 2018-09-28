import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Snackbar from 'material-ui/Snackbar'

const styles = theme => ({})

const LoadingErrorMessage = (props) => {
  const { error } = props
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={error}
      SnackbarContentProps={{
        'aria-describedby': 'loading',
      }}
      message={<span id="message-id">Sorry, something went wrong.</span>}
    />
  )
}

LoadingErrorMessage.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(LoadingErrorMessage)
