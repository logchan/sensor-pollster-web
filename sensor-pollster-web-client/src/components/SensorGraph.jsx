import React from 'react'
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  styler
} from "react-timeseries-charts";
import { TimeSeries } from "pondjs";

export default function SensorGraph(props) {
  const sensors = props.data
  const getter = props.getter

  const style = styler(sensors.map(s => {return {
    key: s.name,
    color: props.info.get(s.address)?.color ?? "black",
    width: 2
  }}))

  const all_values = sensors.reduce((arr, s) => arr.concat(s.data.map(d => getter(d))), []).sort((a, b) => a-b)
  const max = all_values[all_values.length - 1]
  const min = all_values[0]

  return <ChartContainer timeRange={new TimeSeries({
    columns: ["time"],
    points: [[props.start.getTime()], [props.end.getTime()]]
  }).timerange()} width={props.width}>
  <ChartRow height="200">
      <YAxis id="axis" label={props.label} min={min} max={max} width="60" type="linear" format=".2f" tickCount={10}/>
      <Charts>
        {sensors.map(s => {
          return <LineChart key={s.address} axis="axis" series={new TimeSeries({
            name: s.name,
            columns: ["time", s.name],
            points: s.data.map(d => [new Date(d.time).getTime(), getter(d)]).reverse()
          })}
          style={style}
          columns={[s.name]}/>
        })}
      </Charts>
  </ChartRow>
</ChartContainer>
}