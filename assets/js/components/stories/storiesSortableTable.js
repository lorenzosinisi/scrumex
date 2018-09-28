import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { Link } from 'react-router-dom'
// MUI
import Card, { CardContent } from 'material-ui/Card'
import { withStyles } from 'material-ui/styles'
import IconButton from 'material-ui/IconButton'
import Equalizer from 'material-ui-icons/Equalizer'
import VerticalAlignTopIcon from 'material-ui-icons/VerticalAlignTop'
import VerticalAlignBottomIcon from 'material-ui-icons/VerticalAlignBottom'

const styles = theme => ({
  row: {
    width: '100%',
    padding: theme.spacing.unit * 0.4,
    'list-style': 'none'
  },
  link: {
    color: theme.palette.a,
    'font-weight': '500',
    '&:hover': {
      color: theme.palette.a,
    }
  },
  list: {
    'padding-left': 0
  },
  rightItem: {
    float: 'right',
    marginRight: theme.spacing.unit * 2
  },
  singleStory: {
    boxShadow: 'none',
    borderBottom: theme.palette.divider,
    cursor: 'move'
  },
  iconInfo: {
    fontSize: theme.spacing.unit * 2,
    height: 'auto',
  },
  singleDraggableItem: {
    paddingBottom: theme.spacing.unit
  }
})

const SortableItem = SortableElement(({value, classes, handleRankLast, handleRankFirst}) =>
  <Card raised={false} className={classes.singleStory}>
    <CardContent className={classes.singleDraggableItem}>
      <li className={classes.row}>
      <Link className={classes.link} to={`/app/projects/${value.project_id}/stories/${value.id}`} title='view story'>
        {value.title}
      </Link>
        <span className={classes.rightItem}>
          <Link to={`/app/projects/${value.project_id}/stories/${value.id}/vote`} title='view story'>
            <IconButton className={classes.iconInfo} icon={<Equalizer/>} label="Story Points"> <Equalizer /> {value.story_points} </IconButton>
          </Link>
        </span>
        <span className={classes.rightItem}>
          <IconButton onClick={(e) => handleRankFirst(value)} className={classes.iconInfo} icon={<VerticalAlignTopIcon/>} label="Top of the backlog"> <VerticalAlignTopIcon /> </IconButton>
        </span>

        <span className={classes.rightItem}>
          <IconButton onClick={(e) => handleRankLast(value)}  className={classes.iconInfo} icon={<VerticalAlignBottomIcon/>} label="Bottom of the backlog"> <VerticalAlignBottomIcon /> </IconButton>
        </span>

        <span className={classes.rightItem}>
          {value.closed ? "Closed" : "Open"}
        </span>
      </li>
    </CardContent>
  </Card>
)

const SortableList = SortableContainer(({items, classes, handleRankLast, handleRankFirst}) => {
  return (
    <ul className={classes.list}>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} handleRankLast={handleRankLast} handleRankFirst={handleRankFirst} classes={classes} index={index} value={value} />
      ))}
    </ul>
  )
})

const StoriesSortableTable = ({ data, classes, onSortEnd, handleRankLast, handleRankFirst}) => {
  if (!data) { return <div /> }
  return <SortableList
          pressDelay={200}
          items={data}
          classes={classes}
          onSortEnd={onSortEnd}
          handleRankLast={handleRankLast}
          handleRankFirst={handleRankFirst}
          />
}

StoriesSortableTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array
}

export default compose(
  withRouter,
  withStyles(styles)
)(StoriesSortableTable)
