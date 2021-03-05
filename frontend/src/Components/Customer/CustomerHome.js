import React, { useState, useEffect, useContext } from 'react';
import CustomerService from '../../Services/CustomerService';
import {AuthContext} from '../../Context/AuthContext';
import Message from '../Notify/Message';
// import { Link } from 'react-router-dom';
import EachProduct from './EachProduct';

const CustomerHome = () =>{

    const [products , setProducts] = useState([]);
    const [message, setMessage] = useState(null);

    const {user} = useContext(AuthContext);
    // console.log("authcontext => ",authContext);


    useEffect(()=>{
        CustomerService.getProductsToHome().then(data =>{
            setProducts(data.products);
            setMessage(data.message);
        });
    } , []);

    return(
<div>
            <h1>Welcome {user.username}</h1>
            
            <hr />
            <ul>
                {
                    (Array.isArray(products) && products.length) ?
                        products.map(product => {
                            return <EachProduct
                                key={product._id}
                                product={product}
                                // history={props.history}
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


export default CustomerHome;