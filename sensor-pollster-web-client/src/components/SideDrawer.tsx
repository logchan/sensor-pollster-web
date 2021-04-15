import React from 'react'
import { Drawer, makeStyles, List, ListItem, ListItemIcon, ListItemText, Toolbar, Divider } from '@material-ui/core'
import DashboardIcon from '@material-ui/icons/Dashboard'
import TimelineIcon from '@material-ui/icons/Timeline'
import { linkDashboard, linkGraphs } from '../utils/Routing'
import { useHistory } from 'react-router-dom'

class SideDrawerProps {
  width = 240
}

export default function SideDrawer(props: SideDrawerProps) {
  const drawerWidth = props.width
  const useStyles = makeStyles((theme) => {
    return {
      drawer: {
        width: drawerWidth,
        flexShrink: 0
      },
      drawerPaper: {
        width: drawerWidth
      },
      nested: {
        paddingLeft: theme.spacing(4)
      }
    }
  })
  const classes = useStyles()
  const history = useHistory()

  const makeItem = (text: string, url: string | null, icon: JSX.Element, nested = false) => {
    return (<ListItem button onClick={() => {
      if (url !== null) {
        history.push(url)
      }
    }} className={nested ? classes.nested : ""}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </ListItem>)
  }
  return (<Drawer
    className={classes.drawer}
    variant="permanent"
    classes={{
      paper: classes.drawerPaper
    }}>
    <Toolbar />
    <List>
      {makeItem("Dashboard", linkDashboard(), <DashboardIcon />)}
      {makeItem("Graphs", linkGraphs(), <TimelineIcon />)}
    </List>
  </Drawer>)
}