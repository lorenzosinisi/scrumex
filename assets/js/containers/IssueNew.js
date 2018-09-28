import React, { Component } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
// MUI
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import { actionGetProject, actionCreateIssue } from '../actions'
import Button from 'material-ui/Button'
import Select from 'material-ui/Select'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl } from 'material-ui/Form'
import WithLoader from '../hocs/WithLoader'

import {
  loadingSelector,
  errorSelector
} from '../selectors/createdIssueSelector'

import {
  currentProjectSelector
} from '../selectors/showProjectSelector'

import {
  userSelector
} from '../selectors/userSelector'

const styles = theme => ({
  main: theme.mixins.gutters({
    width: '98%',
    maxWidth: theme.palette.centeredColumn.maxWidth,
    margin: '0 auto',
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit
  }),
  form: {
    flexGrow: 1,
    '& button': {
      outline: 0
    }
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    '@media(max-width: 540px)': {
      flexDirection: 'column'
    }
  },
  textField: {
    width: '99%',
    '@media(max-width: 540px)': {
      width: '70%'
    }
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    '@media(max-width: 540px)': {
      width: '100%'
    }
  },
  formControl: {
    margin: theme.spacing.unit,
    'margin-left': theme.spacing.unit,
    minWidth: 120
  },
  formControlBig: {
    'margin-top': theme.spacing.unit,
    'margin-left': theme.spacing.unit,
    width: '60%'
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
})

class StoryNew extends Component {
  state = {
    title: '',
    repos: [],
    description: '',
    repository_id: '',
    entries: [],
    scale_type: 'fibonacci_scale',
    project_id: null
  }

  componentDidMount () {
    const { user } = this.props
    const projectId = this.props.match.params.project_id
    this.props.loadCurrentProject(user, projectId)
    this.setState({
      project_id: projectId
    })
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  handleCreateIssue = (e) => {
    e.preventDefault()
    console.log(e)
    this.props.create(this.state)
  }

  render () {
    let { title } = this.state
    const { classes: {
      form,
      main,
      row,
      textField,
      button,
      formControl,
      formControlBig
        },
        currentProject
      } = this.props

    return (
      <div className={main}>
        
        <form className={form} onSubmit={(e) => this.handleCreateIssue(e)}>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Typography type='headline'>
                Create a Story:
              </Typography>
              <TextField
                required
                id='required'
                type='text'
                label='Name the Issue'
                value={title}
                className={textField}
                margin='normal'
                onChange={this.handleChange('title')}
                />
            </Grid>
            <Grid item xs={12}>
              <div className={row}>
                <FormControl className={formControlBig}>
                  <TextField
                    id='description'
                    label='Description'
                    multiline
                    rowsMax='4'
                    rows='4'
                    cols='50'
                    value={this.state.description}
                    onChange={this.handleChange('description')}
                    className={textField}
                    margin='normal'
                  />
                </FormControl>
              </div>
            </Grid>

          </Grid>
          <Button
            raised
            color='primary'
            type='submit'
            className={button}
          >
            Create Issue
          </Button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  user: userSelector(),
  loading: loadingSelector(),
  error: errorSelector(),
  currentProject: currentProjectSelector()
})

function mapDispatchToProps (dispatch) {
  return {
    loadCurrentProject: (userToken, projectId) => dispatch(actionGetProject.request(userToken, projectId)),
    create: (data) => dispatch(actionCreateIssue.save(data))
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  WithLoader
)(StoryNew)
