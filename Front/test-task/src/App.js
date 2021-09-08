import React from 'react';
import {BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import Items from './components/Items.js'
import ItemsStatistic from './components/ItemsStatistic'

function App() {
  return (
      <Router>
        <div className="app">
          <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <Link to="/" style={{ marginLeft: 20, marginRight: 20 }}><h3>Items</h3></Link>
            <Link to="/items-statistic"><h3>Items Statistic</h3></Link>
          </nav>
          <div class="ml-5 mr-5 mt-5">
            <Switch>
              <Route exact path='/' component={Items}/>
              <Route exact path='/items-statistic' component={ItemsStatistic}/>
            </Switch>
          </div>
        </div>
      </Router>
  );
}

export default App;
