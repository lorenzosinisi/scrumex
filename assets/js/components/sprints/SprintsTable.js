import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { withStyles } from 'material-ui/styles'
import { Link } from 'react-router-dom'
import moment from 'moment'

// MUI
import Card, { CardContent } from 'material-ui/Card'

const styles = theme => ({
  root: {
    overflowX: 'auto'
  },
  card: {
    boxShadow: 'none',
    borderBottom: theme.palette.divider
  },
  link: {
    color: theme.palette.a,
    '&:hover': {
      color: theme.palette.a,
    },
    'font-weight': '500'
  },
})

const SprintsTable = ({ classes, data }) => {
  const { root, card } = classes
  if (!data) { return <div /> }

  const sortedData = data.sort(function(a, b){
    var a = new Date(a.inserted_at),
        b = new Date(b.inserted_at);
      // Compare the 2 dates
      if(a < b) return 1;
      if(a > b) return -1;
      return 0;
  })

  return (
    <div className={root}>
    {
      sortedData.map((sprint, index) => (
        <Card raised={false}  key={index} className={card}>
          <CardContent>
             <Link className={classes.link} to={`/app/projects/${sprint.project_id}/sprints/${sprint.id}`} title='view sprint'>
               {sprint.name}
             </Link>
          </CardContent>
        </Card>
      ))
    }
  </div>
  )
}

SprintsTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array
}

export default compose(
  withRouter,
  withStyles(styles)
)(SprintsTable)
