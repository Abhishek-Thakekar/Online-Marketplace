import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Login from './Components/Authentication/Login';
import Register from './Components/Authentication/Register';
import Navbar from './Components/Navigation/Navbar';
import Admin from './Components/Admin/Admin';
import AddProduct from './Components/Admin/AddProduct';
import EditProduct from './Components/Admin/EditProduct';
import CustomerHome from './Components/Customer/CustomerHome';
import CustomerCart from './Components/Customer/CustomerCart';
import Pay from './Components/Order/Pay';
import MyOrders from './Components/Order/MyOrders';


import PrivateRoute from './Hocs/PrivateRoute';
import UnPrivateRoute from './Hocs/UnPrivateRoute';

const App = () =>{
  return(
    <Router>
      <Navbar/>
      <PrivateRoute exact path="/" roles={["admin", "user"]} component={CustomerHome} />
      <PrivateRoute exact path="/cart" roles={["user"]} component={CustomerCart} />
      <PrivateRoute path="/admin" roles={["admin"]} component={Admin} />
      <PrivateRoute path="/addProduct" roles={["admin"]} component={AddProduct} />
      <PrivateRoute path="/editProduct" roles={["admin"]} component={EditProduct} />
      <PrivateRoute exact path="/pay" roles={["user"]} component={Pay} />
      <PrivateRoute exact path="/myorders" roles={["user"]} component={MyOrders} />



      <UnPrivateRoute path="/login" component={Login} />
      <UnPrivateRoute path="/register" component={Register} />
    </Router>
  )
}

export default App;


