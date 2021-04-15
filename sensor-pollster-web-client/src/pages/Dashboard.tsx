import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Client from '../models/Client'
import Sensor from '../models/Sensor'
import { vsmall } from '../utils/JsxUtils'

class DashboardState {
  data: Sensor[] = []
}

export default function Dashboard() {
  const client = new Client()
  const [state, setState] = useState(new DashboardState())
  const updateState = () => setState({...state})
  const fetchData = async () => {
    try {
      state.data = await client.getAllSensorData(1)
      return true
    }
    catch (ex) {
      console.error(ex)
      return false
    }
  }
  
  useEffect(() => {
    (async () => {
      if (await fetchData()) {
        updateState()
      }
    })()
  })

  return <div>
    <Typography variant="h3">Dashboard</Typography>
    {vsmall()}
    <Grid container>
      <Grid item sm={8}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Sensor</TableCell>
                <TableCell align="right">Temperature</TableCell>
                <TableCell align="right" style={{width: 100}}>Battery</TableCell>
                <TableCell align="right" style={{width: 100}}>RSSI</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>MAC</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { state.data.map(sensor => {
                let data = sensor.data[0]
                return <TableRow key={sensor.address}>
                  <TableCell>{sensor.name}</TableCell>
                  <TableCell align="right">{data.temperature}</TableCell>
                  <TableCell align="right">{data.battery}</TableCell>
                  <TableCell align="right">{data.rssi}</TableCell>
                  <TableCell>{data.time}</TableCell>
                  <TableCell>{sensor.address}</TableCell>
                </TableRow>
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  </div>
}