import React, { useState, useEffect } from 'react';
import AdminService from '../../Services/AdminService';
import Message from '../Notify/Message';
import { Link } from 'react-router-dom';
import ProductItem from './ProductItem';


const Admin = (props) => {

    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState(null);


    useEffect(() => {
        AdminService.getProducts().then(data => {
            console.log(data.products);
            setProducts(data.products);
            setMessage(data.message);
        })
    }, []);


    return (
        <div className="body-div">
            <h1 className="page-title">Welcome Admin</h1>
            <Link to="/addProduct">
                <button className="btn  bg-warning btn-outline-dark">New Product <i className="fas fa-plus-circle"></i></button>
            </Link>
            <hr />
            <div className="card-deck">
                {
                    (Array.isArray(products) && products.length) ?
                        products.map(product => {
                            return <ProductItem
                                key={product._id}
                                product={product}
                                // history={props.history}
                            />
                        })
                        : <p>Nothing to show</p>
                }
            </div>
            {message ? <Message message={message} /> : null}
        </div>

    );

}

export default Admin;