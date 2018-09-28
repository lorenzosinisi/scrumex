import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { compose } from 'recompose'
import Delete from 'material-ui-icons/Delete'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Person from 'material-ui-icons/Person';
import WorkIcon from 'material-ui-icons/Work';
import BeachAccessIcon from 'material-ui-icons/BeachAccess';
import Divider from 'material-ui/Divider';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input'
import { FormControl } from 'material-ui/Form'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 1200,
    margin: 'auto',
    backgroundColor: theme.palette.background.paper,
  },
  list: {
    width: '100%',
    margin: 'auto',
    maxWidth: 620,
  },
  rootForm: {
    'margin-left': 16,
    width: '80%'
  },
  form: {
    width: '100%',
    'margin-bottom': 0
  }
})

const MemberForm = ({classes, handleCreatMember, handleChange, email}) => {
  return (
    <div className={classes.root}>
      <div className={classes.list}>
      <strong>Add a new member by e-mail:</strong>
      <List>
          <div>
          <ListItem>
            <Avatar>
              <Person />
            </Avatar>
            <form className={classes.form} onSubmit={e => handleCreatMember(e.preventDefault())}>
              <Input
                id="multiline-flexible"
                rowsMin="4"
                onChange={(e) => handleChange(e, 'email')}
                className={classes.rootForm}
                disableUnderline={true}
                value={email}
                type="email"
                placeholder={"name@company.com"}
                InputProps={{
                  classes: {
                    root: classes.rootForm,
                    input: classes.root,
                  },
                }}
                InputLabelProps={{
                  className: classes.label,
                }}
              />

              <Button
                color='primary'
                type='submit'
                >
                  Invite
                </Button>
            </form>
          </ListItem>
          <li>
            <Divider inset />
          </li>
          </div>
        </List>
      </div>
    </div>
  )
}

export default compose(
  withStyles(styles)
)(MemberForm)
