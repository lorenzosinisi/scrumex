import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { withStyles } from 'material-ui/styles'
import Table, {
  TableHead,
  TableRow,
  TableCell
} from 'material-ui/Table'

import ProjectsTableRows from './ProjectsTableRows'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    width: '100%'
  }
})

const ProjectsTable = ({ classes, data, gotToProject, deleteProject }) => {
  const { table, root } = classes
  return (
    <div className={`TableContainer ${root}`}>
      <Table className={table}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Delete</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Members</TableCell>
          </TableRow>
        </TableHead>
        <ProjectsTableRows projects={data} onDelete={deleteProject} something='SOMGHI' />
      </Table>
    </div>
  )
}

ProjectsTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array
}

export default compose(
  withRouter,
  withStyles(styles)
)(ProjectsTable)
