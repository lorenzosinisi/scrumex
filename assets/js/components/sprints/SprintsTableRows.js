import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import ViewIcon from 'material-ui-icons/RemoveRedEye'

import {
  TableBody,
  TableRow,
  TableCell
} from 'material-ui/Table'

const SprintsTableRows = ({data}) => {
  return (
    <TableBody>
      {data && data.map(sprint => {
        return (
          <TableRow key={sprint.id}>
            <TableCell>{sprint.name}</TableCell>
            <TableCell>
              <Link to={`/app/projects/${sprint.project_id}/sprints/${sprint.id}`} title='view Sprint'>
                <ViewIcon />
              </Link>
            </TableCell>
            <TableCell>
              <Link to={`/app/projects/${sprint.project_id}/sprints/${sprint.id}`} title='view Sprint'>
                {sprint.closed ? 'Closed' : 'Open'}
              </Link>
            </TableCell>
          </TableRow>
        )
      })}
    </TableBody>
  )
}

SprintsTableRows.propTypes = {
  sprints: PropTypes.array
}

export default SprintsTableRows
