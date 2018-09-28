import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { withStyles } from 'material-ui/styles'
import { actionGetRepos, actionCreateProject } from '../actions'
import { getSelectValuesIndex } from '../utils'
import ProjectForm from '../components/projects/form'
import WithLoader from '../hocs/WithLoader'
import WithExternalLinks from '../hocs/WithExternalLinks'

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

class ProjectNew extends Component {
  static propTypes = {
    user: PropTypes.string
  }
  state = {
    name: '',
    collaborators: [''],
    repos: []
  }

  componentDidMount () {
    const { user } = this.props
    this.props.loadRepos(user)
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
    const { repos } = this.state
    const { userRepos } = this.props
    const selector = document.getElementById('initValues')
    const selectedOpt = getSelectValuesIndex(selector)

    selectedOpt.forEach(opt => repos.push(userRepos[opt]))
    _.pullAt(userRepos, selectedOpt)

    this.setState({
      repos
    })
  }

  handleRemoverepos = () => {
    const { repos } = this.state
    const { userRepos } = this.props
    const selector = document.getElementById('finalValues')
    const selectedOpt = getSelectValuesIndex(selector)

    selectedOpt.forEach(opt => userRepos.push(repos[opt]))
    _.pullAt(repos, selectedOpt)

    this.setState({
      repos
    })
  }

  handleCreateProject = (e) => {
    e.preventDefault()
    this.props.createProject(this.state)
  }

  render () {
    let { name, collaborators, repos } = this.state
    const { classes: { main }, userRepos } = this.props
    return (
      <div className={main}>
        <ProjectForm
          title="Create a new Project"
          handleCreateProject={this.handleCreateProject}
          handleChange={this.handleChange}
          userRepos={userRepos}
          handleAddrepos={this.handleAddrepos}
          handleRemoverepos={this.handleRemoverepos}
          handleAddEmail={this.handleAddEmail}
          repos={repos}
          collaborators={collaborators}
          handleChangeEmail={this.handleChangeEmail}
          handleRemoveEmail={this.handleRemoveEmail}
          buttonTitle={"Create"}
        />
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  userRepos: reposSelector(),
  user: userSelector(),
  loading: loadingSelector(),
  error: createProjectErrorSelector()
})

function mapDispatchToProps (dispatch) {
  return {
    loadRepos: (userToken) => dispatch(actionGetRepos.request(userToken)),
    createProject: (data) => dispatch(actionCreateProject.save(data))
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  WithLoader,
  WithExternalLinks
)(ProjectNew)
