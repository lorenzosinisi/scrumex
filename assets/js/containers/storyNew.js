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
import { FormControl, FormLabel } from 'material-ui/Form'
import WithLoader from '../hocs/WithLoader'
import ReactMde, { ReactMdeTypes } from "react-mde"

interface ReactMdeDemoProps {}

interface ReactMdeDemoState {
  reactMdeValue: ReactMdeTypes.Value;
}

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
    'max-width': '890px',
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
    flexWrap: 'wrap'
  },
  textField: {
    width: '99%',
    'font-family': 'Arial, Helvetica, sans-serif !important',
    '@media(max-width: 540px)': {
      width: '70%'
    },
    '#multiline-flexible': {
      'font-family': 'monospace !important',
    }
  },
  textFieldClass: {
    width: '99%',
    'font-family': 'Arial, Helvetica, sans-serif !important',
    '@media(max-width: 540px)': {
      width: '70%'
    },
    '#multiline-flexible': {
      'font-family': 'monospace !important',
    }
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    float: "right",
    '@media(max-width: 540px)': {
      width: '100%'
    }
  },
  formControl: {
    margin: theme.spacing.unit,
    'margin-left': theme.spacing.unit,
    minWidth: "100%"
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

class ProjectNew extends Component {
  state = {
    title: '',
    repos: [],
    description: 'As a < type of user >, I want < some goal > so that < some reason >.\n\n\The story is considered done when I < action to perform > and < what should happen >\n\n\n\n',
    repository_id: '',
    entries: [],
    scale_type: 'fibonacci_scale',
    project_id: null,
    reactMdeValue: { text: "" }
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
    this.props.create(this.state)
  }

  handleValueChange = (value: ReactMdeTypes.Value) => {
    this.setState({ reactMdeValue: value })
    this.setState({ description: this.state.reactMdeValue.text })
  }

  render () {
    let { title } = this.state
    const { classes: {
      form,
      main,
      row,
      textField,
      textFieldClass,
      button,
      formControl,
      formControlBig
        },
        currentProject
      } = this.props

    return <div>
        <div className={main}>
        <form className={form} onSubmit={e => this.handleCreateIssue(e)}>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Typography type="headline">Create a new Story</Typography>
            </Grid>
            <Grid item xs={12}>
              <div className={row}>
                <FormControl className={formControl}>
                  <FormLabel>Name:</FormLabel>
                  <TextField required id="required" type="text" value={title} className={textField} margin="normal" onChange={this.handleChange("title")} />
                </FormControl>
              </div>
              <div className={row}>
                <FormControl className={formControl}>
                  <FormLabel>Content:</FormLabel>
                  <TextField
                    id="multiline-flexible"
                    multiline
                    rowsMin="4"
                    value={this.state.description}
                    onChange={this.handleChange('description')}
                    className={textField}
                    InputProps={{
                      classes: {
                        root: textFieldClass,
                        input: textFieldClass,
                      },
                    }}
                    InputLabelProps={{
                      className: textFieldClass,
                    }}
                    margin="normal"
                  />
                </FormControl>
              </div>
            </Grid>
          </Grid>
          <Button raised color="primary" type="submit" className={button}>
            Create
          </Button>
        </form>
      </div>
    </div>
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
)(ProjectNew)
