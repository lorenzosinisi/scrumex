import React, { Component } from 'react'
import { compose } from 'recompose'
import { withStyles } from 'material-ui/styles'
import { withRouter, Link } from 'react-router-dom'
// MUI
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

const styleSheet = theme => ({
  card: {
    minWidth: 200,
    maxWidth: 345,
    width: '100%',
    float: 'left',
    margin: 15,
    'text-align': 'center'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    textTransform: 'uppercase',
    fontSize: '2em'
  },
  pos: {
    fontSize: '1.8em',
    opacity: 0.8,
  },
  cardAction: {
    float: 'right'
  },
  linkToCard: {
    'text-decoration': 'none !important',
    'a': {
      'text-decoration': 'none !important'
    }
  }
})

class CardItem extends Component {
  render () {
    const { classes, title, counter, icon, link } = this.props
    const bull = <span className={classes.bullet}>•</span>;
    return (
      <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} variant="headline" align="center" color="primary">
          </Typography>
          <Typography variant="headline" component="h2">
          </Typography>
          <Typography className={classes.pos}>
            {icon}{counter}
          </Typography>
          <Typography component="p">
          </Typography>
        </CardContent>
        {title && <CardActions className={classes.cardAction}>
          <Link className={classes.linkToCard} to={link}>
          <Button size="small" color="primary">
             {title}
          </Button>
          </Link>
        </CardActions>}
        {!link && <CardActions className={classes.cardAction} />}

      </Card>
    </div>
    )
  }
}

export default compose(
  withRouter,
  withStyles(styleSheet)
)(CardItem)
