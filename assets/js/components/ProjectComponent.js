import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Divider from 'material-ui/Divider'

class ProjectComponent extends Component {
  render () {
    return (
      <div>
        NAME: {this.props.currentProject.name}
        <Divider />
        <Link to={`/app/projects/${this.props.currentProject.id}/issues/new`}>
          New Issue
        </Link>
      </div>
    )
  }
}

export default ProjectComponent
