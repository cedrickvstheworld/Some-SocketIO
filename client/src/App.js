import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom';

// components
import LandingPage from './components/landing_page';
import Main from './components/main';

// css
import 'materialize-css/dist/css/materialize.min.css';
import './static/css/main.css';

const Route = require('react-router-dom').Route;

class App extends Component {
  render() {
    return (
      <div className="App">
          <Router>
            <Route path="/" exact component={LandingPage} />
            <Route path="/main" exact component={Main} />
          </Router>
      </div>
    )
  }
}

export default App;

