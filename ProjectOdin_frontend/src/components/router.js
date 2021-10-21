import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import Box from '@mui/material/Box';

import Home from './Home';
import Query from './Query';
import Dash from './Dash';

import '../static/Query.css';
export default function App(){
    return (<Router>
      <div>
        <ul>
      <Box sx={{display:'flex', justifyContent:'space-between'}}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/query">Query</Link>
          </li>
          <li>
            <Link to="/dash">Dash</Link>
          </li>
          </Box>
        </ul>

        <hr />

        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/query">
            <Query />
          </Route>
          <Route path="/dash">
            <Dash containerId={"id0"}
            neo4jUri={"bolt://192.168.0.15:7687"}
            neo4jUser={"neo4j"}
            neo4jPassword={"devlocal"}
            />
          </Route>
        </Switch>
      </div>
    </Router>);
}