import React, { useState, useEffect, useContext } from 'react';
import CustomerService from '../../Services/CustomerService';
import {AuthContext} from '../../Context/AuthContext';
import Message from '../Notify/Message';
// import { Link } from 'react-router-dom';
import EachProduct from './EachProduct';

const CustomerHome = () =>{

    const [products , setProducts] = useState([]);
    const [message, setMessage] = useState(null);
    const [productImage, setProductImage] = useState(null);

    const {user} = useContext(AuthContext);
    // console.log("authcontext => ",authContext);


    useEffect(()=>{
        CustomerService.getProductsToHome().then(data =>{
            setProducts(data.products);
            setMessage(data.message);
        });
    } , []);

    const onFileChange = e => {
        setProductImage(e.target.files);
    };

    const onImageSubmit = e => {console.log("onimagesubmit");
        e.preventDefault();

        const formData = new FormData();
        
        formData.append(`productImage`, productImage[0]);
        CustomerService.searchImage(formData).then(data => {
            console.log("onimagesubmit" , data.productId);
        });
    };

    return(
        <div>
            <h1>Welcome {user.username}</h1>
            
            <hr />

            <div>

            <form onSubmit={onImageSubmit}>
                <label htmlFor="productImage" className="sr-only">productImage: </label>
                <input type="file"
                    name="productImage"
                    onChange={onFileChange}
                    className="form-control"
                    placeholder="Upload Image " />
                
                <button className="btn btn-lg btn-primary btn-block"
                    type="submit">Search Image</button>
            </form>

        </div>

            <div className="card-deck">
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
            </div>
            
            <br />

            {message ? <Message message={message} /> : null}
        </div>
    );
}


export default CustomerHome;