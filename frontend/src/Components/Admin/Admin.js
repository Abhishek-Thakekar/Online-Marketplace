import React, { useState, useEffect } from 'react';
import AdminService from '../../Services/AdminService';
import Message from '../Notify/Message';
import { Link } from 'react-router-dom';
import ProductItem from './ProductItem';


const Admin = () => {

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
        <div>
            <h1>Welcome Admin</h1>
            <Link to="/addProduct">
                <button>New Product</button>
            </Link>
            <hr />
            <ul>
                {
                    (Array.isArray(products) && products.length) ?
                        products.map(product => {
                            return <ProductItem
                                key={product._id}
                                product={product}
                            />
                        })
                        : <p>Nothing to show</p>
                }
            </ul>
            <br />

            {message ? <Message message={message} /> : null}
        </div>

    );

}

export default Admin;