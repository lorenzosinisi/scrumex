import React, { Component } from 'react'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import ProjectsTable from '../components/projects/ProjectsTable'
import Floating from '../components/buttons/floating'
import WithExternalLinks from '../hocs/WithExternalLinks'

import {
  projectsSelector,
  loadingSelector,
  errorSelector
} from '../selectors/projectsSelector'

import {
  userSelector
} from '../selectors/userSelector'

import {
  actionGetMyProjects,
  actionDeleteProject
} from '../actions'

import WithLoader from '../hocs/WithLoader'

const styles = theme => ({
  main: theme.mixins.gutters({
    width: '98%',
    margin: '0 auto',
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit
  })
})

class ProjectsContainer extends Component {
  componentDidMount () {
    const { user } = this.props
    this.props.loadMyProjects(user)
  }

  gotToProject = (id) => {
    this.props.history.push('/app/projects/' + id + '/dashboard')
  }


  handleDelete = (id, project) => {
    const { user } = this.props
    let confirmation = confirm(`Are you sure you want to delete the project "${project.name}"?`)
    if (confirmation == true) {
      this.props.deleteProject(id)
      this.props.loadMyProjects(user)
    }
  }

  render () {
    const { classes: { main }, projectsData } = this.props
    return (
      <div className={main}>
        <Floating path={"/app/projects/new"} />
        <div className='card'>
          <h4 className='card-header'>
              My projects
            </h4>
          <ProjectsTable
            data={projectsData.mine}
            gotToProject={this.gotToProject}
            deleteProject={this.handleDelete}
            />
        </div>

        <div className='card'>
          <h4 className='card-header'>
              Contributing
            </h4>
          <ProjectsTable
            data={projectsData.collaborating}
            gotToProject={this.gotToProject}
            />
        </div>
      </div>

    )
  }
}

const mapStateToProps = createStructuredSelector({
  projectsData: projectsSelector(),
  user: userSelector(),
  loading: loadingSelector(),
  error: errorSelector()
})

function mapDispatchToProps (dispatch) {
  return {
    loadMyProjects: (user_token) => dispatch(actionGetMyProjects.request(user_token)),
    deleteProject: (id) => dispatch(actionDeleteProject.request(id))
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  WithLoader,
  WithExternalLinks
)(ProjectsContainer)
