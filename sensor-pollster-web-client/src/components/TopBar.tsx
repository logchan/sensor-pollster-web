import React from 'react'
import { makeStyles, AppBar, Toolbar, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => {
  return {
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    }
  }
})

export default function TopBar() {
  const classes = useStyles()

  return (<AppBar position="fixed" className={classes.appBar}>
    <Toolbar>
      <Typography variant="h6" noWrap>
        Sensor Pollster
    </Typography>
    </Toolbar>
  </AppBar>)
}