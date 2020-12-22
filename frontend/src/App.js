import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Login from './Components/Authentication/Login';
import Register from './Components/Authentication/Register';
import Home from './Components/HomePage/Home';
import Navbar from './Components/Navigation/Navbar';
import Admin from './Components/Admin/Admin';
import AddProduct from './Components/Admin/AddProduct';


import PrivateRoute from './Hocs/PrivateRoute';
import UnPrivateRoute from './Hocs/UnPrivateRoute';

const App = () =>{
  return(
    <Router>
      <Navbar/>
      <PrivateRoute exact path="/" roles={["admin", "user"]} component={Home} />
      <PrivateRoute path="/admin" roles={["admin"]} component={Admin} />
      <PrivateRoute path="/addProduct" roles={["admin"]} component={AddProduct} />


      <UnPrivateRoute path="/login" component={Login} />
      <UnPrivateRoute path="/register" component={Register} />
    </Router>
  )
}

export default App;


