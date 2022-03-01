import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Signup from './component/signup';
import Welcome from './component/welcome';
import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Signup />
        </Route>
        <Route path="/confirm/:confirmationCode" component={Welcome} />
      </Switch>
    </Router>
  );
}

export default App;
