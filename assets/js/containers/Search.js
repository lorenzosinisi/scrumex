import React, { Component } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import SearchComponent from '../components/search/index'
import { createStructuredSelector } from 'reselect'
// MUI
import { withStyles } from 'material-ui/styles'
import { withRouter } from 'react-router-dom'
import Typography from 'material-ui/Typography'
import WithExternalLinks from '../hocs/WithExternalLinks'


import {
  actionGetProject,
  actionSearchStories
} from '../actions'

import {
  searchStoriesSelector,
  loadingSelector,
  errorSelector
} from '../selectors/searchStories'

import WithLoader from '../hocs/WithLoader'

import {
  currentProjectSelector
} from '../selectors/showProjectSelector'


const styles = theme => ({
  main: theme.mixins.gutters({
    width: '98%',
    margin: '0 auto',
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit
  }),
  searchInHistory: {
    padding: theme.spacing.unit * 2,
    paddingLeft: 40
  }
})

class Search extends Component {

  componentDidMount() {
    this.props.loadSearchStories("", this.props.match.params.project_id)
    this.props.loadProject(null, this.props.match.params.project_id)
  }

  handleSearch = (term) => {
    this.props.loadSearchStories(term, this.props.match.params.project_id)
  }

  render() {
    const { classes, searchStories, project } = this.props
    return <div>
        <Typography className={classes.searchInHistory} type='display1'>{project.name} / search stories</Typography>
        <SearchComponent project={project} searchStories={searchStories} handleSearch={this.handleSearch}/>
      </div>
  }
}


const mapStateToProps = createStructuredSelector({
  loading: loadingSelector(),
  error: errorSelector(),
  project: currentProjectSelector(),
  searchStories: searchStoriesSelector()
})

function mapDispatchToProps (dispatch) {
  return {
    loadProject: (user, project) =>  dispatch(actionGetProject.request(user, project)),
    loadSearchStories: (term, project_id) => dispatch(actionSearchStories.request(term, project_id))
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  WithLoader,
  withRouter,
  WithExternalLinks
)(Search)
