import React from 'react'
import PropTypes from 'prop-types'
import Avatar from 'material-ui/Avatar'
import Chip from 'material-ui/Chip'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  chip: {
    margin: theme.spacing.unit,
    float: 'left'
  },
  avatar: {
    'font-size': theme.spacing.unit * 1.3
  }
})

const storyVoteOptions = ({entries, handleVote, classes}) => {
  if (!entries) { return <div /> }
  const { chip, avatar } = classes
  return (
    <div>
      {entries.map(entry => {
        return (
          <Chip
            key={entry.id}
            avatar={<Avatar className={avatar}>{entry.title}</Avatar>}
            label="points"
            className={chip}
            onClick={ () => handleVote(entry) }
          />
        )
      })}
    </div>
  )
}

storyVoteOptions.propTypes = {
  description: PropTypes.string
}

export default  withStyles(styles)(storyVoteOptions)
