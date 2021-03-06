import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import AuthService from '../../Services/AuthService';


const Navbar = props => {
    const { user, setUser, isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

    const unauthenticatedNavbar = () => {
        return (
            <>
                <Link to="/">
                    <li className="nav-item nav-link">
                        Home
                    </li>
                </Link>

                <Link to="/login">
                    <li className="nav-item nav-link">
                        Login
                    </li>
                </Link>

                <Link to="/register">
                    <li className="nav-item nav-link">
                        Register
                    </li>
                </Link>
            </>
        )
    }

    const authenticatedNavbar = () => {
        return (
            <>
                {
                    user.role === 'admin' ?
                        <Link to="/admin">
                            <li className="navbar-brand">
                                Admin
                        </li>
                        </Link> :
                        null

                }
                {
                    user.role === 'admin' ?
                        <Link to="/admin_orders">
                            <li className="navbar-brand">
                                Orders
                            </li>
                        </Link> :
                        <Link to="/myorders">
                            <li className="navbar-brand">
                                MyOrders
                            </li>
                        </Link>

                }
                {
                    user.role === 'user' ?
                    <>
                        <Link to="/cart">
                            <li className="navbar-brand">
                                Cart
                        </li>
                        </Link>
                        <Link to="/">
                            <li className="navbar-brand">
                                Home
                            </li>
                        </Link>
                    </> :
                        null
                }

                {
                    user.role === 'admin' ?
                        <Link to="/delivery">
                            <li className="navbar-brand">
                                Delivery
                        </li>
                        </Link> :
                        null

                }

                <button type="button"
                    className="btn btn-link nav-item nav-link"
                    onClick={onClickLogoutHandler}>
                    Logout
                </button>




            </>
        )
    }

    const onClickLogoutHandler = () => {
        AuthService.logout().then(data => {
            if (data.success) {
                setUser(data.user);
                setIsAuthenticated(false);
            }
        });
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">


            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    {!isAuthenticated || !user ? unauthenticatedNavbar() : authenticatedNavbar()}

                </ul>

            </div>
        </nav>
    );
}

export default Navbar;