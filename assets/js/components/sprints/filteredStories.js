import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import SwipeableViews from 'react-swipeable-views';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';

import StoriesTable from '../stories/storiesTable'

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    boxShadow: 'none'
  },
  appBar: {
    boxShadow: 'none'
  },
  storiesTable: {
    padding: 10,
    width: '100%',
    margin: '0 auto',
    boxShadow: 'none'
  },
  tabs: {
    boxShadow: 'none'
  },
  dashedDiv: {
    color: 'rgba(0, 0, 0, 0.54)',
    padding: 10,
    'border-width': 2,
    'border-color': 'rgba(0, 0, 0, 0.54)',
    'border-style': 'dashed',
    'border-radius': 5,
    margin: 20
  }
})

class FullWidthTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const { classes, theme, stories, team, storiesDone, storiesInProgress, storiesOpen, sprintName } = this.props;

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar} position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth={true}
            className={classes.tabs}
          >
            <Tab label="Sprint backlog" />
            <Tab label="Open" />
            <Tab label="In progress" />
            <Tab label="Done" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <div className={classes.storiesTable} dir={theme.direction}>
            {stories && stories.length == 0 && <div className={classes.dashedDiv}>Choose one of the stories in the backlog and change their sprint into {`"${sprintName}"`}. Use the menu on the left to get to the project "backlog".</div>}
            <StoriesTable className={classes.storiesTable} data={stories} team={team} />
          </div>
          <div className={classes.storiesTable} dir={theme.direction}>
            {storiesOpen && storiesOpen.length == 0 && <div className={classes.dashedDiv}> No story open, add a new open story to this sprint.</div>}
            <StoriesTable data={storiesOpen} team={team} />
          </div>
          <div className={classes.storiesTable} dir={theme.direction}>
            {storiesInProgress && storiesInProgress.length == 0 && <div className={classes.dashedDiv}> Assign an open story to yourself to mark it as 'in progress'. In this way you will make it visible that you are taking care of it at the moment.</div>}
            <StoriesTable data={storiesInProgress} team={team} />
          </div>
          <div className={classes.storiesTable} dir={theme.direction}>
          {storiesDone && storiesDone.length == 0 && <div className={classes.dashedDiv}>None of the stories is yet done. When they meet your definition of done, make sure to mark them as done.</div>}
            <StoriesTable  data={storiesDone} team={team} />
          </div>
        </SwipeableViews>
      </div>
    );
  }
}

FullWidthTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(FullWidthTabs);
