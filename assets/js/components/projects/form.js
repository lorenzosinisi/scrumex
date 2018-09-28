import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
// MUI
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import AddIcon from 'material-ui-icons/AddCircle'
import RemoveIcon from 'material-ui-icons/RemoveCircle'
import { actionGetRepos, actionCreateProject } from '../../actions'
import LeftIcon from 'material-ui-icons/KeyboardArrowLeft'
import RightIcon from 'material-ui-icons/KeyboardArrowRight'
import Button from 'material-ui/Button'
import { getSelectValuesIndex } from '../../utils'

import {
  reposSelector,
  loadingSelector
} from '../../selectors/reposSelector'

import {
  userSelector
} from '../../selectors/userSelector'

import {
  createProjectErrorSelector
} from '../../selectors/createdProjectSelector'

const styles = theme => ({
  main: theme.mixins.gutters({
    width: '98%',
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
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '99%',
    '@media(max-width: 540px)': {
      width: '70%'
    }
  },
  emailFieldWraper: {
    positon: 'relative',
    width: '100%'
  },
  eamilField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: theme.spacing.unit * 35,
    '&:first-child': {
      marginRight: theme.spacing.unit * 6
    },
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
  addButton: {
    height: theme.spacing.unit * 4.5
  },
  removeButton: {
    color: theme.palette.error[900]
  },
  selectorWrapper: {
    flexGrow: 2,
    '& select': {
      padding: theme.spacing.unit,
      width: '100%'
    },
    '@media(max-width: 540px)': {
      width: '100%'
    }
  },
  selectorsTitle: {
    marginBottom: theme.spacing.unit * 2
  },
  selectorButtons: {
    width: theme.spacing.unit * 6,
    '@media(max-width: 540px)': {
      width: '100%',
      textAlign: 'center',
      '& button': {
        transform: 'rotate(90deg)'
      }
    }
  }
})

const ProjectForm = (props) => {
  const { classes: {
      form,
      main,
      row,
      textField,
      emailFieldWraper,
      button,
      addButton,
      removeButton,
      selectorWrapper,
      selectorsTitle,
      selectorButtons,
      eamilField
      },
      name,
      collaborators,
      repos,
      handleChange,
      handleAddEmail,
      handleChangeEmail,
      handleRemoveEmail,
      handleAddrepos,
      handleRemoverepos,
      handleCreateProject,
      userRepos,
      title,
      buttonTitle
  } = props
  return (
    <div className={main}>
      <form className={form} onSubmit={handleCreateProject}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Typography type='headline'>
             {title}
            </Typography>
            <TextField
              required
              id='required'
              type='text'
              label='Project Name'
              value={name}
              className={textField}
              margin='normal'
              onChange={(e) => handleChange(e, 'name')}
            />
          </Grid>
        </Grid>
        <Button
          raised
          color='primary'
          type='submit'
          className={button}
        >
          {buttonTitle}
        </Button>
      </form>
    </div>
  )
}

export default compose(
  withStyles(styles)
)(ProjectForm)
