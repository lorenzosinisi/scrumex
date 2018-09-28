import React, { Component } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
// MUI
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import { actionGetProject, actionCreateSprint } from '../actions'
import Button from 'material-ui/Button'
import Select from 'material-ui/Select'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl } from 'material-ui/Form'
import WithLoader from '../hocs/WithLoader'
import DayPicker from 'react-day-picker'
import WithExternalLinks from '../hocs/WithExternalLinks'

import {
  currentProjectSelector,
  loadingSelector,
  errorSelector
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
    width: '100%',
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
  sprintName: {

  },
  textField: {
    margin: theme.spacing.unit,
    'margin-left': theme.spacing.unit,
    width: '99%',
    '@media(max-width: 540px)': {
      width: '70%'
    }
  },
  textFieldName: {
    margin: theme.spacing.unit,
    'margin-left': 15,
    width: '99%',
    '@media(max-width: 540px)': {
      width: '70%'
    }
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    float: 'right',
    '@media(max-width: 540px)': {
      width: '100%'
    }
  },
  formControl: {
    margin: theme.spacing.unit,
    'margin-left': theme.spacing.unit,
    minWidth: 120
  },
  selectDate: {
    width: '50%',
    float: 'left',
    paddingTop: 40
  },
  describeDated: {
    'padding-left': 22
  }
})

class SprintNew extends Component {
  state = {
    name: '',
    duration: 1,
    projectId: null,
    start_date: '',
    due_date: '',
    today: '',
    selectedDay: undefined,
    selectedDayEnd: undefined
  }

  componentDidMount () {
    const { user } = this.props
    const projectId = this.props.match.params.project_id
    this.props.loadCurrentProject(user, projectId)
    this.setState({projectId})
  }

  handleDayClick(day) {
    this.setState({ start_date: day });
  }

  handleDayEndClick(day) {
    this.setState({ due_date: day });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  handleChangeDate = name => event => {
    this.setState({
      [name]: new Date(event.target.value)
    })
  }

  handleCreateSprint = (e) => {
    e.preventDefault()
    console.log(e, this.state)
    this.props.create(this.state)
  }

  render () {
    let { name, duration, today } = this.state
    const { classes: {
      main,
      sprintName,
      form,
      row,
      textField,
      button,
      formControl,
      textFieldName,
      selectDate,
      describeDated
    }} = this.props

    return (
      <div className={main}>
      <Typography type='headline'>
        Create a new Sprint
      </Typography>
        <form className={form} onSubmit={(e) => this.handleCreateSprint(e)}>
          <Grid container spacing={24} className={sprintName}>

            <Grid item xs={12}>
              <div className={row}>
                <TextField
                  required
                  id='required'
                  type='text'
                  label='Name the Sprint'
                  value={name}
                  className={textFieldName}
                  margin='normal'
                  onChange={this.handleChange('name')}
                    />
              </div>
            </Grid>
            <div className={selectDate}>
              {this.state.start_date ? (
                <p className={describeDated}>Star of the sprint: {this.state.start_date.toLocaleDateString()}</p>
              ) : (
                <p className={describeDated}>Select the start date:</p>
              )}
              <DayPicker onDayClick={this.handleDayClick.bind(this)} />
            </div>
            <div className={selectDate}>
              {this.state.due_date ? (
                <p className={describeDated}>End of the sprint: {this.state.due_date.toLocaleDateString()}</p>
              ) : (
                <p className={describeDated}>Select the end date:</p>
              )}

              <DayPicker onDayClick={this.handleDayEndClick.bind(this)} />
          </div>
          </Grid>
          <Button
            raised
            color='primary'
            type='submit'
            className={button}
            >
              Create
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
    create: (data) => dispatch(actionCreateSprint.save(data))
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  WithLoader,
  WithExternalLinks
)(SprintNew)
