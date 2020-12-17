import React, { useContext } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Login from './Components/Login';
import Register from './Components/Register';
import Home from './Components/Home';
import Navbar from './Components/Navbar';


import PrivateRoute from './Hocs/PrivateRoute';
import UnPrivateRoute from './Hocs/UnPrivateRoute';

const App = () =>{
  return(
    <Router>
      <Navbar/>
      <PrivateRoute exact path="/" roles={"admin", "user"} component={Home} />
      <UnPrivateRoute path="/login" component={Login} />
      <UnPrivateRoute path="/register" component={Register} />
    </Router>
  )
}

export default App;


