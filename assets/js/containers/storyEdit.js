import React, { Component } from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect"
import { withRouter } from 'react-router-dom'
import ReactMde, { ReactMdeTypes } from "react-mde"
import Card from 'material-ui/Card'

interface ReactMdeDemoProps {}

interface ReactMdeDemoState {
  reactMdeValue: ReactMdeTypes.Value;
}

// MUI
import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";
import TextField from "material-ui/TextField";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import Select from "material-ui/Select";
import Input, { InputLabel } from "material-ui/Input";
import { FormControl, FormLabel } from "material-ui/Form";
import WithLoader from "../hocs/WithLoader";
import WithExternalLinks from '../hocs/WithExternalLinks'
import _ from 'lodash'

import {
  actionGetProject,
  actionStory,
  actionGetSprints
} from "../actions"

import {
  teamSelector
} from '../selectors/teamSelector'

import {
  loadingSelector,
  errorSelector,
  storySelector
} from '../selectors/storySelector'

import {
  sprintsSelector
} from '../selectors/sprintsSelector'

import { currentProjectSelector } from "../selectors/showProjectSelector";
import { userSelector } from "../selectors/userSelector";

const styles = theme => ({
  main: theme.mixins.gutters({
    width: "98%",
    maxWidth: theme.palette.centeredColumn.maxWidth,
    margin: "0 auto",
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit
  }),
  form: {
    padding: 10,
    paddingRight: 20,
    flexGrow: 1,
    "& button": {
      outline: 0,
      float: 'right',
    }
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: "20px"
  },
  textField: {
    width: "99%",
    "@media(max-width: 540px)": {
      width: "70%"
    },
    'font-family': 'monospace !important',
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
    float: 'right',
    "@media(max-width: 540px)": {
      width: "100%"
    }
  },
  formControl: {
    margin: theme.spacing.unit,
    padding: "0px",
    "margin-left": theme.spacing.unit,
    width: "100%"
  },
  formControlBig: {
    "margin-top": "20px",
    "margin-left": theme.spacing.unit,
    width: "100%"
  },
  formControlBigSelect: {
    "margin-left": theme.spacing.unit,
    width: "60%"
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },
  sprintSelect: {
    'padding-top': theme.spacing.unit * 3
  },
  labelAddSprintStyle: {
    'font-size': "12px"
  },
  rowContent: {
    marginTop: theme.spacing.unit * 2
  },
  buttonCancelHeader: {
    float: 'right',
    top: -5
  }
});

class StoryEdit extends Component {
  state = {
    id: null,
    title: "",
    repos: [],
    description: "",
    repository_id: "",
    list_id: "",
    entries: [],
    scale_type: "fibonacci_scale",
    project_id: null,
    onSuccess: () => {},
    reactMdeValue: { text: "" }
  }

  componentDidMount() {
    const { user } = this.props;
    const projectId = this.props.match.params.project_id;
    this.props.loadCurrentProject(user, projectId)
    this.props.loadStory(this.props.match.params)
    this.props.loadSprints(projectId)
  }

  componentWillReceiveProps(nextProps) {
    let { story: { id, list_id, title, description, repos, repository_id, entries, scale_type, project_id } } = nextProps;
    this.setState({
      title,
      repos,
      entries,
      id,
      scale_type,
      project_id,
      description,
      reactMdeValue: {text: description},
      list_id,
      onSuccess: nextProps.history.goBack
    })
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  filterActiveSprints(sprints) {
    return _.filter(sprints, sprint => {
      return sprint.closed !== true
    })
  }

  handleUpdateStory = e => {
    e.preventDefault();
    this.props.update(this.state);
  };

  handleValueChange = (value: ReactMdeTypes.Value) => {
    this.setState({ reactMdeValue: value })
    this.setState({ description: this.state.reactMdeValue.text })
  }

  render() {
    let { title } = this.state;
    const {
      classes: {
        form,
        main,
        row,
        rowContent,
        textField,
        textFieldClass,
        button,
        formControl,
        formControlBig,
        sprintSelect,
        formControlBigSelect,
        labelAddSprintStyle,
        buttonCancelHeader
      },
      sprints
    } = this.props;

    const activeSprints = this.filterActiveSprints(sprints)

    return (
      <div className={main}>
      <Card>
        <Typography type="title" className="card-header">
        Edit story
        <Button
          id="multiline-flexible"
          multiline
          onClick={this.props.history.goBack}
          className={buttonCancelHeader}
          rowsMax="4"
          type="cancel"
        >
          Cancel
        </Button>
        </Typography>
        <form className={form} onSubmit={e => this.handleUpdateStory(e)}>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <div className={row}>
                <FormControl className={formControl}>
                <FormLabel>Name:</FormLabel>
                  <TextField
                    required
                    id="required"
                    type="text"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={title}
                    className={textField}
                    margin="normal"
                    onChange={this.handleChange("title")}
                  />
                </FormControl>
              </div>
              <div className={row}>
                <FormControl className={formControlBigSelect}>
                  <FormLabel>Sprint:</FormLabel>
                  <Select
                    native
                    required
                    fullWidth={false}
                    value={this.state.list_id}
                    onChange={this.handleChange("list_id")}
                    input={<Input id="list_id" />}
                  >
                    <option value=""> Backlog </option>
                    {activeSprints.map(sprint => {
                      return (
                        <option key={sprint.id} value={sprint.id}>
                          {sprint.name}
                        </option>
                      );
                    })}
                  </Select>
                  </FormControl>
              </div>
              <div className={row}>
                <FormControl className={formControlBig}>
                  <FormLabel>Content:</FormLabel>
                  <TextField
                    id="multiline-flexible"
                    multiline
                    rowsMin="4"
                    InputProps={{
                      classes: {
                        root: textFieldClass,
                        input: textFieldClass,
                      },
                    }}
                    InputLabelProps={{
                      shrink: true,
                      className: textFieldClass,
                    }}
                    value={this.state.description}
                    onChange={this.handleChange('description')}
                    className={textField}
                    margin="normal"
                  />
                </FormControl>
              </div>
              <Button
                raised
                id="multiline-flexible"
                color="primary"
                multiline
                rowsMax="4"
                type="submit"
              >
                Save
              </Button>

            </Grid>
          </Grid>
        </form>
      </Card>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  user: userSelector(),
  loading: loadingSelector(),
  error: errorSelector(),
  sprints: sprintsSelector(),
  story: storySelector(),
  team: teamSelector(),
  user: userSelector()
});

function mapDispatchToProps(dispatch) {
  return {
    loadCurrentProject: (userToken, projectId) =>
      dispatch(actionGetProject.request(userToken, projectId)),
    update: data => dispatch(actionStory.update(data)),
    loadStory: (data) =>  dispatch(actionStory.request(data)),
    loadTeam: (data) => dispatch(actionTeam.request(data)),
    loadSprints: (projectId) =>  dispatch(actionGetSprints.request(projectId)),
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  WithLoader,
  withRouter,
  WithExternalLinks
)(StoryEdit)
