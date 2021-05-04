import React, { useState, useEffect, useContext } from 'react';
import CustomerService from '../../Services/CustomerService';
import {AuthContext} from '../../Context/AuthContext';
import Message from '../Notify/Message';
// import { Link } from 'react-router-dom';
import EachProduct from './EachProduct';
import Loader from "react-loader-spinner";
import './CustomerHome.css';

const CustomerHome = () =>{

    const [products , setProducts] = useState([]);
    const [newProducts , setNewProducts] = useState([]);
    const [message, setMessage] = useState(null);
    const [productImage, setProductImage] = useState(null);
    const [productImageUrl, setProductImageUrl] = useState(null);
    const [imageSearchFlag, setImageSearchFlag] = useState("false");
    const [loadingFlag, setLoadingFlag] = useState("false");

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

    const onFileChange = e => {
        setProductImage(e.target.files);
        let reader = new FileReader();
        let url = reader.readAsDataURL(e.target.files[0]);

        reader.onloadend = function (e) {
            setProductImageUrl(reader.result);
        }
    };

    const onImageSubmit = e => {console.log("onimagesubmit");
        e.preventDefault();

        setLoadingFlag("true");
 

        const formData = new FormData();
        formData.append(`productImage`, productImage[0]);

        CustomerService.searchImage(formData).then(data => {console.log("data", data.productId);
            let temp = products.filter((product) => {
                return product._id === data.productId;
            })
            setNewProducts(temp);
            setImageSearchFlag("true");
            setLoadingFlag("false");
        });
    };
    
    const resetImage = () => {
        setNewProducts(products);
        setProductImage(null);
        setProductImageUrl(null);
        setImageSearchFlag("false");
    }
    return(
        <div className="body-div">
            <h1 className="page-title">Welcome {user.username}</h1>
            <input type="text"  className="input-text" onChange={inputChange}   
                   placeholder="Search for products...  "/><i className="fas fa-search text-warning"></i>
            <hr />

            <div>

            <form onSubmit={onImageSubmit}>
                <label htmlFor="productImage" className="custom-file-upload btn bg-warning btn-outline-dark">
                    Upload <i className="fas fa-upload"></i></label>
                <input type="file" accept="image/*"
                    id="productImage"
                    onChange={onFileChange}
                    className="form-control"
                    placeholder="Upload Image" className="btn bg-warning btn-outline-dark upload-btn"/>
                
                <img src={productImageUrl} id="upload-image-preview"/>
               <br/>
                <button className="btn  bg-warning btn-outline-dark"
                    type="submit" id="image-search-button">Search <i className="fas fa-search "></i></button>

                {
                    (imageSearchFlag == "true") ? (
                        <button className="btn  bg-warning btn-outline-dark" onClick={resetImage}
                            id="image-reset-button">Reset Image</button>
                ): (
                    null
                )
                }
                {
                    (loadingFlag == "true") ? (
                        <Loader type="TailSpin" color="#0275d8" height={30} width={30} />
                ): (
                    null
                )
                }
            </form>
            <hr/>
        </div>

            <div className="card-columns">
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