import React from 'react'
import PropTypes from 'prop-types'
import Markdown from 'react-markdown'

const StoryDescription = ({ description }) => {
  if (!description) { return <div /> }
  return <Markdown source={description} />
}

StoryDescription.propTypes = {
  description: PropTypes.string
}

export default StoryDescription
