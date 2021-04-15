import React, { useState, useEffect, useContext } from 'react';
import CustomerService from '../../Services/CustomerService';
import {AuthContext} from '../../Context/AuthContext';
import Message from '../Notify/Message';
// import { Link } from 'react-router-dom';
import EachProduct from './EachProduct';

const CustomerHome = () =>{

    const [products , setProducts] = useState([]);
    const [newProducts , setNewProducts] = useState([]);
    const [message, setMessage] = useState(null);
    

    const {user} = useContext(AuthContext);
    // console.log("authcontext => ",authContext);

    const inputChange = (e) =>{
        mySearch(e.target.value);
    }
    const mySearch = (query) =>{
        var filter = query.toUpperCase();
        var temp = [];
        for(var i=0; i<products.length ; i++){
            var txt = products[i].productName + " " + products[i].category + " " + products[i].description;
            txt = txt.toUpperCase();
            if(txt.indexOf(filter) > -1){
                temp.push(products[i]);
            }

        }    
        setNewProducts(temp);
    }

    useEffect(()=>{
        CustomerService.getProductsToHome().then(data =>{
            setProducts(data.products);
            setNewProducts(data.products);
            setMessage(data.message);
        });
    } , []);

    return(
<div>
            <h1>Welcome {user.username}</h1>
            <input type="text"  onChange={inputChange}   placeholder="search here"/>

            
            <hr />
            <div className="card-deck">
                {
                    (Array.isArray(newProducts) && newProducts.length) ?
                        newProducts.map(product => {
                            return <EachProduct
                                key={product._id}
                                product={product}
                                // history={props.history}
                            />
                        })
                        : <p>Nothing to show</p>
                }
            </div>
            
            <br />

            {message ? <Message message={message} /> : null}
        </div>
    );
}


export default CustomerHome;