import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import { Toolbar, makeStyles, Typography } from '@material-ui/core'
import SideDrawer from './components/SideDrawer'
import NotFound from './pages/NotFound'
import { vsmall } from './utils/JsxUtils'
import TopBar from './components/TopBar'
import Graphs from './pages/Graphs'

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: "flex"
    },
    content: {
      flexGrow: 1,
      paddingLeft: theme.spacing(3)
    }
  }
})

class AppRouterProps {
  authenticated = false
  title?= ''
  content?= <div></div>
}

export default function AppRouter(props: AppRouterProps) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <TopBar />
      <SideDrawer width={240}></SideDrawer>
      <main className={classes.content}>
        <Toolbar />
        {vsmall()}
        {props.authenticated ?
          <div style={{ paddingRight: "16px" }}>
            <Switch>
              <Route path="/" exact>
                <Dashboard />
              </Route>
              <Route path="/graphs" exact>
                <Graphs />
              </Route>
              <Route path="/">
                <NotFound />
              </Route>
            </Switch>
          </div> :
          <div>
            <Typography variant="h3">{props.title}</Typography>
            {vsmall()}
            {props.content}
          </div>
        }
      </main>
    </div>
  )
}