import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { compose } from 'recompose'
import ViewIcon from 'material-ui-icons/RemoveRedEye'
import Delete from 'material-ui-icons/Delete'
import { withStyles } from 'material-ui/styles'

import {
  TableBody,
  TableRow,
  TableCell
} from 'material-ui/Table'

const styles = theme => ({
  deleteButton: {
    cursor: 'pointer'
  }
})

const ProjectsTableRows = ({classes, projects, onDelete}) => {
  const handleDeleteProject = (e, project, onDelete) => {
    e.preventDefault()
    onDelete(project.id)
  }

  const { deleteButton } = classes
  return (
    <TableBody>
      {projects.map(project => {
        return (
          <TableRow key={project.id}>
            <TableCell numeric>{project.id}</TableCell>
            <TableCell>{project.name}</TableCell>
            <TableCell>
              <Link to={`/app/projects/${project.id}`}>
                <ViewIcon />
              </Link>
              {onDelete &&
                <span className={deleteButton} >
                  <Delete onClick={(e) => handleDeleteProject(e, project, onDelete)} />
                </span>
              }
            </TableCell>
          </TableRow>
        )
      })}
    </TableBody>
  )
}

ProjectsTableRows.propTypes = {
  projects: PropTypes.array
}

export default compose(
  withStyles(styles)
)(ProjectsTableRows)
