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
    onDelete(project.id, project)
  }

  const { deleteButton } = classes
  return (
    <TableBody>
      {projects.map(project => {
        return (
          <TableRow key={project.id}>
            <TableCell>
              <Link to={`/app/projects/${project.id}/dashboard`}>
                {project.name}
              </Link>
            </TableCell>
            <TableCell>
              {onDelete &&
                <span className={deleteButton} >
                  <a onClick={(e) => handleDeleteProject(e, project, onDelete)}> Delete </a>
                </span>
              }
            </TableCell>

            <TableCell>
            {onDelete &&
              <Link to={`/app/projects/${project.id}/edit`}>
                Edit
              </Link>
            }
            </TableCell>

            <TableCell>
            {onDelete &&
              <Link to={`/app/projects/${project.id}/members`}>
                Members
              </Link>
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
