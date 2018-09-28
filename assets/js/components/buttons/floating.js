import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import AddIcon from 'material-ui-icons/Add'
import ModeEditIcon from 'material-ui-icons/ModeEdit'
import { Link } from 'react-router-dom'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    position: 'fixed',
    right: theme.spacing.unit * 3,
    bottom: theme.spacing.unit * 3,
    zIndex: 100000
  },
})

function Floating(props) {
  const { classes, path } = props;
  return (
    <div>
      <Link to={path} title="Somrthing">
        <Button fab color="primary" aria-label="add" className={classes.button}>
          <AddIcon />
        </Button>
      </Link>
    </div>
  )
}

Floating.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Floating)