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
                        Home <i className="fas fa-home"></i>
                    </li>
                </Link>

                <Link to="/login">
                    <li className="nav-item nav-link">
                        Login <i className="fas fa-sign-in-alt"></i>
                    </li>
                </Link>

                <Link to="/register">
                    <li className="nav-item nav-link">
                        Register <i className="fas fa-user-plus"></i>
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
                                Admin <i className="fas fa-user-shield"></i>
                        </li>
                        </Link> :
                        null

                }
                {
                    user.role === 'admin' ?
                        <Link to="/admin_orders">
                            <li className="navbar-brand">
                                Orders <i className="fas fa-gift"></i>
                            </li>
                        </Link> :
                        <Link to="/myorders">
                            <li className="navbar-brand">
                                MyOrders <i className="fas fa-truck"></i>
                            </li>
                        </Link>

                }
                {
                    user.role === 'user' ?
                        <>
                            <Link to="/cart">
                                <li className="navbar-brand">
                                    Cart <i className="fas fa-shopping-cart"></i>
                        </li>
                            </Link>
                            <Link to="/">
                                <li className="navbar-brand">
                                    Home <i className="fas fa-home"></i>
                            </li>
                            </Link>
                        </> :
                        null
                }

                {
                    user.role === 'admin' ?
                        <Link to="/delivery">
                            <li className="navbar-brand">
                                Delivery <i className="fas fa-truck"></i>
                        </li>
                        </Link> :
                        null

                }


                <Link to="/chatbot">
                    <li className="navbar-brand">
                        Chatbot <i className="fas fa-robot"></i>
                    </li>
                </Link>

                <Link type="button"
                    className="btn nav-item nav-link"
                    onClick={onClickLogoutHandler}>
                    Logout <i className="fas fa-sign-out-alt"></i>
                </Link>




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
        <nav className="navbar navbar-expand-sm navbar-dark bg-primary">

        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
            <span class="navbar-toggler-icon"></span>
        </button>
        
            <div className="collapse navbar-collapse" id="collapsibleNavbar">
                <ul className="navbar-nav mr-auto">
                    {!isAuthenticated || !user ? unauthenticatedNavbar() : authenticatedNavbar()}

                </ul>

            </div>
        </nav>
    );
}

export default Navbar;