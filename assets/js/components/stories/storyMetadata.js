import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Divider from 'material-ui/Divider'
import { prettyDateTime } from "../../utils"

const styles = theme => ({
  root: {
    float: 'right',
    padding: 10,
    opacity: 0.5,
    'font-size': 13
  }
})

const StoryMetadata = ({classes, updatedAt, creator}) => {
  return (<div className={classes.root}> Created by {creator} - Last update: {prettyDateTime(updatedAt)}</div>)
}

export default withStyles(styles)(StoryMetadata)
