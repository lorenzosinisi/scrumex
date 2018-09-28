import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
import { withStyles } from 'material-ui/styles'
import { TrimString } from "../../utils"
// MUI
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui-icons/Delete'

const styles = theme => ({
  attachmentListStyle: {
    padding: "10px",
    paddingBottom: 20,
    display: 'grid',
    'grid-template-columns': '1fr 1fr 1fr',
    'grid-gap': '20px'
  },
  buttonDelete: {
    height: 5,
    'font-size': 12,
    position: 'absolute',
    float: 'right',
    'padding-left': 10,
    opacity: 0.8
  },
  downloadLink: {
    color: theme.palette.a,
    '&:hover': {
      color: theme.palette.a,
    }
  },
  img: {
    'max-width': 157,
    float: 'left',
  },
  dotted: {
  }
})

const AttachmentsList = ({attachments, handleDeleteAttachment, classes }) => {
  return (
    <div className={classes.attachmentListStyle}>
      {
        attachments.map(attachment => {
          return (<div className={classes.dotted}>
            <a className={classes.downloadLink} href={attachment.image_url} title={attachment.name}> <img className={classes.img} src={attachment.image_url} /></a>
              <IconButton
              className={classes.buttonDelete}
              aria-label="Delete"
              onClick={handleDeleteAttachment.bind(this, attachment)}
            >

              <DeleteIcon />
                Delete
              </IconButton>
            </div>)
          }
        )
      }
    </div>
  )
}

export default compose(
  withStyles(styles)
)(AttachmentsList)
