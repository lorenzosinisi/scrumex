import React, { Component } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import MemberList from '../components/members/list'
import MemberInvitations from '../components/members/invitations'
import MemberForm from '../components/members/form'
import { createStructuredSelector } from 'reselect'
import WithExternalLinks from '../hocs/WithExternalLinks'
// MUI
import { withStyles } from 'material-ui/styles'
import { withRouter } from 'react-router-dom'
import Typography from 'material-ui/Typography'
import Person from 'material-ui-icons/Person';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input'
import { FormControl } from 'material-ui/Form'
import TextField from 'material-ui/TextField'
import Grid from 'material-ui/Grid'

import {
  actionGetProject,
  actionMembers
} from '../actions'

import WithLoader from '../hocs/WithLoader'

import {
  currentProjectSelector
} from '../selectors/showProjectSelector'

import {
  loadingSelector,
  errorSelector,
  membersSelector
} from '../selectors/membersSelector'

const styles = theme => ({
  main: theme.mixins.gutters({
    width: '98%',
    margin: '0 auto',
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit,
  }),
  members: {
    paddingTop: 60,
    width: '50%',
    'min-width': 300,
    float: 'left'
  },
  membersWrapper: {

  },
  messageWrapper: {
    paddingTop: 20
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
  tip: {
    padding: 46,
    opacity: 0.8,
    'padding-top': 10
  }
})

class Members extends Component {

  state = {
    email: "",
  }

  componentDidMount() {
    this.props.loadProject(null, this.props.match.params.project_id)
    this.props.loadMembers(this.props.match.params.project_id)
  }

  handleChange = (event, name) => {
    this.setState({
      [name]: event.target.value
    })
  }

  handleDeleteMember = email => {
    let confirmation = confirm("Are you sure you want to delete " + email + " from this project?")
    if (confirmation == true) {
      this.props.deleteMember(email, this.props.match.params.project_id)
    }
  }

  handleCreatMember = () => {
    this.props.createMember(this.state.email, this.props.match.params.project_id)
    this.setState({
      email: ""
    })
  }

  render() {
    const { classes, project, members } = this.props

    if (!project) { return <div />}

    if (!project.subscription) {
      return <div className={classes.main}>
        <Typography type='display1'>{project.name} / Members</Typography>

        <div className={classes.messageWrapper}>
          <div className={classes.dashedDiv}>
          Please, upgrade your plan to add team members to this project.
          </div>
        </div>

        <div className={classes.membersWrapper}>
        </div>
      </div>
    }

    if (project && project.subscription) {
    return <div className={classes.main}>
        <Typography type='display1'>{project.name} / Members</Typography>
        <div className={classes.membersWrapper}>
          <div className={classes.members}>
            <MemberForm email={this.state.email} handleChange={this.handleChange} handleCreatMember={this.handleCreatMember}/>
            <p className={classes.tip}>
            By adding an e-mail you will be able to add new team members to this project. If the member is already present in our system (has an account), he/she will be added automatically to the project and will be able to access all its contents.
            <br />
            <br />
            If the user is not present, that person will receive a link to the registration page. After creating an account, by accessing the project dashboard, the invitation will become a membership.
            </p>
          </div>
          <div className={classes.members}>
            <MemberList members={members.users} handleDeleteMember={this.handleDeleteMember}/>
            <MemberInvitations members={members.invitations} handleDeleteMember={this.handleDeleteMember} />
          </div>
        </div>
      </div>
   }

   return <div />
  }

}


const mapStateToProps = createStructuredSelector({
  loading: loadingSelector(),
  error: errorSelector(),
  project: currentProjectSelector(),
  members: membersSelector(),
})

function mapDispatchToProps (dispatch) {
  return {
    loadProject: (user, project) =>  dispatch(actionGetProject.request(user, project)),
    loadMembers: (projectId) =>  dispatch(actionMembers.request(projectId)),
    createMember: (email, projectId) =>  dispatch(actionMembers.create(email, projectId)),
    deleteMember: (email, projectId) =>  dispatch(actionMembers.delete(email, projectId)),
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  WithLoader,
  withRouter,
  WithExternalLinks
)(Members)
