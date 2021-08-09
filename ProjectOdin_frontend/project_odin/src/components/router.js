import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";



import Home from './Home';
import Query from './Query';
import Dash from './Dash';
export default function App(){
    return (<Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/query">Query</Link>
          </li>
          <li>
            <Link to="/dash">Dash</Link>
          </li>
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
            <Dash />
          </Route>
        </Switch>
      </div>
    </Router>);
}