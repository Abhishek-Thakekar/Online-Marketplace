import React, { useState, useEffect, useContext } from 'react';
import CustomerService from '../../Services/CustomerService';
import { AuthContext } from '../../Context/AuthContext';
import Message from '../Notify/Message';
import { Link } from 'react-router-dom';
import EachCartProduct from './EachCartProduct';

const CustomerHome = () => {

    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState(null);
    const [total, setTotal] = useState(0);

    const { user } = useContext(AuthContext);
    // console.log("authcontext => ",authContext);
    const pay = {
        pathname: "/pay",
        products: products,
        total: total
    }


    useEffect(() => {
        CustomerService.getProductsToCart().then(data => {
            setProducts(data.data);
            console.log(typeof (data.data));
            console.log(data.data);
            setMessage(data.message);
            console.log(Array.isArray(products));
            // console.log(data.data.length);

            let temp = 0;
            if (data.data) {
                data.data.forEach(element => {
                    // setTotal(total +  (element.productId.price * element.quantity));
                    temp = temp + (element.productId.price * element.quantity);
                });
            }
            setTotal(temp);
        });
    }, []);

    return (
        <div>
            <h1>Welcome {user.username}</h1>

            <hr />
            <div className="card-column">
                {
                    (Array.isArray(products) && products.length) ?
                        products.map(product => {
                            return <EachCartProduct
                                key={product._id}
                                product={product}
                                // history={props.history}
                                />
                            })
                            : <p>Nothing to show</p>
                }
            </div>
            <h1 className="ml-4">Total Price : {total}</h1>
            {
                (total)?
                <Link to={pay}>
                    <button className="btn bg-warning btn-outline-dark ml-4 mb-3">Place Order</button>
                </Link> : 
                <h3>You have empty cart.</h3>
            }
            <br />

            {message ? <Message message={message} /> : null}
        </div>
    );
}


export default CustomerHome;