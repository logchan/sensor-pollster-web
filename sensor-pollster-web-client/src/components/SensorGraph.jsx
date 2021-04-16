import React, { useState } from 'react'
import { Grid } from '@material-ui/core'
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  styler,
  Legend
} from "react-timeseries-charts";
import { TimeSeries } from "pondjs";

// https://github.com/esnet/react-timeseries-charts/blob/aa9c9b368100d78337b562d9e2833f2d90d9de3d/src/website/packages/charts/examples/currency/Index.js#L60
class CrossHairs extends React.Component {
  render() {
      const { x, y } = this.props;
      const style = { pointerEvents: "none", stroke: "#ccc" };
      if (x !== null && y !== null) {
          return (
              <g>
                  <line style={style} x1={0} y1={y} x2={this.props.width} y2={y} />
                  <line style={style} x1={x} y1={0} x2={x} y2={this.props.height} />
              </g>
          );
      } else {
          return <g />;
      }
  }
}

export default function SensorGraph(props) {
  const sensors = props.data
  const getter = props.getter
  const [ mouseState, setMouseState ] = useState({
    x: null,
    y: null
  })
  const [ trackerState, setTrackerState ] = useState({
    tracker: null
  })

  const style = styler(sensors.map(s => {return {
    key: s.name,
    color: props.info.get(s.address)?.color ?? "black",
    width: 2
  }}))

  const tv = t => new Date(t).getTime()
  const startTime = props.start.getTime()
  const endTime = props.end.getTime()
  const inRange = data => tv(data.time) >= startTime && tv(data.time) <= endTime

  const all_values = sensors.reduce((arr, s) => arr.concat(s.data.filter(inRange).map(d => getter(d))), []).sort((a, b) => a-b)
  const max = all_values[all_values.length - 1]
  const min = all_values[0]

  const all_series = {}
  sensors.forEach(s => {
    all_series[s.name] = new TimeSeries({
      name: s.name,
      columns: ["time", s.name],
      points: s.data.map(d => [new Date(d.time).getTime(), getter(d)]).reverse()
    })
  })

  const tracker_values = {}
  if (trackerState.tracker) {
    sensors.forEach(s => {
      const series = all_series[s.name]
      tracker_values[s.name] = series.at(series.bisect(trackerState.tracker)).get(s.name).toString()
    })
  }

  return <div>
    <Grid container><Grid item sm={12}>
      <ChartContainer timeRange={new TimeSeries({
            columns: ["time"],
            points: [[startTime], [endTime]]
          }).timerange()}
          onTrackerChanged={tracker => { 
            setTrackerState({tracker})
            if (tracker === null) {
              setMouseState({x: null, y: null})
            }
         }}
          width={props.width}
          onMouseMove={(x, y) => setMouseState({x, y})}
          timeAxisTickCount={12}
        >
        <ChartRow height="200">
            <YAxis id="axis" label={props.label} min={min} max={max} 
                    width="60" type="linear" format=".2f" tickCount={8}/>
            <Charts>
              {sensors.map(s => {
                return <LineChart key={s.address} axis="axis" series={all_series[s.name]}
                style={style}
                columns={[s.name]}/>
              })}
              <CrossHairs x={mouseState.x} y={mouseState.y} />
            </Charts>
        </ChartRow>
      </ChartContainer>
    </Grid></Grid>
    <Grid container><Grid item sm={12}>
      <Legend
        type="line"
        align="left"
        style={style}
        categories={sensors.map(s => { return {
          key: s.name,
          label: s.name,
          value: tracker_values[s.name] ?? "--"
        }})}
      />
    </Grid></Grid>
  </div>
}