import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { withStyles } from 'material-ui/styles'
import WithExternalLinks from '../hocs/WithExternalLinks'

import {
  actionGetRepos,
  actionProject,
  actionGetProject
} from '../actions'

import { getSelectValuesIndex } from '../utils'
import ProjectForm from '../components/projects/form'
import WithLoader from '../hocs/WithLoader'

import {
  reposSelector,
  loadingSelector
} from '../selectors/reposSelector'

import {
  userSelector
} from '../selectors/userSelector'

import {
  createProjectErrorSelector
} from '../selectors/createdProjectSelector'

import {
  currentProjectSelector
} from '../selectors/showProjectSelector'


const styles = theme => ({
  main: theme.mixins.gutters({
    width: '98%',
    maxWidth: theme.palette.centeredColumn.maxWidth,
    margin: '0 auto',
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit
  })
})

class ProjectEdit extends Component {
  static propTypes = {
    user: PropTypes.string
  }
  state = {
    name: '',
    collaborators: [''],
    repositories: [],
    id: ''
  }

  componentDidMount () {
    const { user } = this.props
    this.props.loadRepos(user)
    this.props.loadCurrentProject(user, this.props.match.params.project_id)
  }

  componentWillReceiveProps(nextProps) {
    let { project: { collaborators, repositories, name, id } } = nextProps
    this.setState({
      collaborators,
      repositories,
      name,
      id
    })
  }

  handleChange = (event, name) => {
    this.setState({
      [name]: event.target.value
    })
  }

  handleAddEmail = () => {
    let { collaborators } = this.state
    collaborators.push('')
    this.setState({
      collaborators
    })
  }

  handleChangeEmail = (i, value) => {
    const { collaborators } = this.state

    collaborators[i] = value
    this.setState({
      collaborators
    })
  }

  handleRemoveEmail = (e, index) => {
    let oldList = this.state.collaborators
    let collaborators = oldList.filter((email, i) => i !== index)
    this.setState({
      collaborators
    })
  }

  handleAddrepos = () => {
    const { repositories } = this.state
    const { userRepos } = this.props
    const selector = document.getElementById('initValues')
    const selectedOpt = getSelectValuesIndex(selector)

    selectedOpt.forEach(opt => repositories.push(userRepos[opt]))
    _.pullAt(userRepos, selectedOpt)

    this.setState({
      repositories
    })
  }

  handleRemoverepos = () => {
    const { repositories } = this.state
    const { userRepos } = this.props
    const selector = document.getElementById('finalValues')
    const selectedOpt = getSelectValuesIndex(selector)

    selectedOpt.forEach(opt => userRepos.push(repositories[opt]))
    _.pullAt(repositories, selectedOpt)

    this.setState({
      repositories
    })
  }

  handleUpdateProject = (e) => {
    e.preventDefault()
    this.props.updateProject(this.state)

  }

  render () {
    let { name, collaborators, repositories } = this.state
    const { classes: { main }, userRepos } = this.props
    if (!this.props.project.id) { return <div /> }
    return (
      <div className={main}>
        <ProjectForm
          title="Edit Project"
          name={name}
          handleCreateProject={this.handleUpdateProject}
          handleChange={this.handleChange}
          userRepos={userRepos}
          handleAddrepos={this.handleAddrepos}
          handleRemoverepos={this.handleRemoverepos}
          handleAddEmail={this.handleAddEmail}
          handleRemoveEmail={this.handleRemoveEmail}
          repos={repositories}
          collaborators={collaborators}
          handleChangeEmail={this.handleChangeEmail}
          buttonTitle={"Save"}
        />
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  userRepos: reposSelector(),
  user: userSelector(),
  project: currentProjectSelector(),
  loading: loadingSelector(),
  error: createProjectErrorSelector()
})

function mapDispatchToProps (dispatch) {
  return {
    loadRepos: (userToken) => dispatch(actionGetRepos.request(userToken)),
    createProject: (data) => dispatch(actionCreateProject.save(data)),
    loadCurrentProject: (userToken, projectId) => dispatch(actionGetProject.request(userToken, projectId)),
    updateProject: (data) => dispatch(actionProject.update(data)),
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  WithLoader,
  WithExternalLinks
)(ProjectEdit)
