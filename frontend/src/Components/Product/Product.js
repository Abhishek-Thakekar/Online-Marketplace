import React, { useState, useEffect, useContext } from 'react';
import CustomerService from '../../Services/CustomerService';
import Message from '../Notify/Message';
import { Slide , Fade, Zoom} from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import './Product.css'

const Product = (props) => {
    const [product , setProduct] = useState({});
    const [message, setMessage] = useState(null);

    const productId = props.match.params.productId;
    console.log(productId);
    useEffect(()=>{
       
        CustomerService.getAProduct(productId).then(data =>{
            console.log(data);
            setProduct(data.product);
            setMessage(data.message);
        });
        } , []);

    const handleAddToCart = () => {
        let item = {
            productId: productId,
            quantity: 1,
            suggestion: ""
        }
        CustomerService.addToCart(item).then(data => {
            const { message } = data;
            setMessage(message);
        });
    }

    const imgPath = "/uploads/" + productId + "/";
    let arr = [0, 1, 2];

    const zoomOutProperties = {
        duration: 3000,
        transitionDuration: 500,
        infinite: true,
        indicators: true,
        scale: 0.4,
        arrows: true
    };

    const Slideshow = () => {
        return (
            <div className="slide-container" >
                <Zoom {...zoomOutProperties}>
                    {
                    arr.map(element => {
                        let newPath = imgPath + element + ".jpg"
                        return (
                            <img className="card-img-bottom" key={element}  src={newPath} onError={(e) => { e.target.src = '/blank.jpg' }} />

                        )
                    })
                    }
                </Zoom>
            </div>
        );
    };

    return (
        <div className="rowCart card bg-light body-div product-page">
        <div className="card-body">

            {message ? <Message message={message} /> : null}
    
            <Slideshow />

            <h3 className="card-title">{product.productName} </h3>
            <h5 className="card-text">Rs.{window.numberWithCommas(product.price)}/-</h5>
            <p className="card-text">{product.aboutProduct}</p>

            <button className="btn bg-warning btn-outline-dark" onClick={handleAddToCart}>
                Add to Cart <i className="fas fa-cart-plus"></i></button>

        </div>
        </div>
    )
}

export default Product;