import React from 'react'
import PropTypes from 'prop-types'
import { Line } from "react-chartjs" // .Line
import moment from 'moment'
import { compose } from 'recompose'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  burndownChartRoot: {
    '@media(max-width: 750px)': {
      display: 'none'
    }
  }
})

const BurnDownChart = ({ data, classes }) => {
  const {target, days} = data
  if (!days) { return <div /> }
  const duration = days.length;
  const idealBurnPerDay = target / (duration - 1)
  let idealBurndown = new Array()
  let alreadyBurned = 0

  let realBurndown = days.map((day, index) => {
    let burnedToday = day[index + 1].burned.points
    alreadyBurned = alreadyBurned + burnedToday
    return Math.round(target - alreadyBurned)
  })

  for (let i = 0; i < duration; i++) {
    let burned = idealBurnPerDay * i
    idealBurndown.push(Math.round(burned))
  }

  const chart_data = {
    labels: days.map((day, index) => {
      let current_day = day[index + 1].date
      return moment(current_day).format('MMMM Do YYYY')
    }
    ),
    datasets: [
      {
        label: "Ideal Burndown",
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: idealBurndown.reverse()
      },
      {
        label: "Current Burndown",
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: realBurndown
      }
    ]
  }

  return (
    <Line data={chart_data} width={870} height={350} className={classes.burndownChartRoot}/>
  )
}

export default compose(
  withStyles(styles)
)(BurnDownChart)
