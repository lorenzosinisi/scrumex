import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import WithExternalLinks from '../hocs/WithExternalLinks'
import Button from 'material-ui/Button'

import {
  CardElement,
  StripeProvider,
  Elements,
  injectStripe
} from 'react-stripe-elements';

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
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    maxWidth: 1200,
    margin: '0 auto',
  }),
  projectBilling: {
    padding: 30,
  },
  creditCardForm: {
    maxWidth: 500
  },
  styleButtonSubscribe: {
    float: 'right',
    height: '30px',
    'font-size': theme.spacing.unit * 1.5,
    width: 'auto',
    marginRight: theme.spacing.unit,
    marginTop: 20,
  },
  dashedDiv: {
    color: 'rgba(0, 0, 0, 0.54)',
    padding: 10,
    'border-width': 2,
    'border-color': 'rgba(0, 0, 0, 0.54)',
    'border-style': 'dashed',
    'border-radius': 5,
    margin: 20,
    marginLeft: 0,
  },
})

class _CardForm extends Component {
  constructor(props, context) {
    super(props, context);
  }
  state = {}

  componentDidMount () {
    this.setState({loading: false})
    console.log(this.props.project)
  }

  upgradeProject = (project) => (payload) => {
    this.setState({loading: true})
    this.props.upgradeProject({...payload, project: project})
  }

  render() {

    if (this.state.loading && !this.props.project.subscription) {
      return (<div className={this.props.dashedDiv}>Loading...</div>)
    }

    if (!this.props.project) {
      return (<div></div>)
    }

    if (this.props.project && this.props.project.subscription) {
      return (<div className={this.props.dashedDiv}>
          This project has an active subscription, send an email to <a href="mailto:info@scrumex.com">info@scrumex.com</a> to change or delete the subscription.
          <br /> Feel free to contact us for any question regarding subscriptions or payments.

          <br /><br /> Please mention the code <code>{this.props.project.subscription.id}</code> in our communication to make it easier helping you.
          </div>)
    }

    return (
      <div style={{marginTop: 20}}>
      <Typography type='headline'>
        Enter your credit card details
      </Typography>
      <form style={{marginTop: 20, marginBottom: 20}} onSubmit={(e) => {
          e.preventDefault()
          this.props.stripe.createToken().then(this.upgradeProject(this.props.project))
        }}>
        <CardElement />
        <Button type="submit" raised color="primary" aria-label="Subscribe" className={this.props.styleButtonSubscribe}>
          Upgrade
        </Button>
      </form>
      <div style={{fontSize: 12, marginTop: 20}}>Powered by <a target="blank" href="https://stripe.com">Stripe</a></div>
      </div>
    )
  }
}

const CardForm = injectStripe(_CardForm)

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
    const { classes: { main, projectBilling, creditCardForm, styleButtonSubscribe, dashedDiv }, userRepos } = this.props
    if (!this.props.project.id) { return <div /> }
    return (
      <div className={main}>
        <Paper>
          <ProjectForm
            title="Project name"
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
            buttonTitle={"Update"}
          />
        </Paper>
        <Paper className={projectBilling}>
          <Typography type='headline'>
            Plan: {this.props.project && this.props.project.subscription ? 'Premium' : 'free' }
          </Typography>
          <Elements>
            <CardForm
              style={creditCardForm}
              styleButtonSubscribe={styleButtonSubscribe}
              dashedDiv={dashedDiv}
              subscription={this.props.project.subscription}
              stripe={this.props.stripe}
              project={this.props.project}
              upgradeProject={this.props.upgradeProject}/>
          </Elements>
        </Paper>
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
    upgradeProject: (data) => dispatch(actionProject.upgrade(data))
  }
}
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  WithLoader,
  WithExternalLinks
)(ProjectEdit)
