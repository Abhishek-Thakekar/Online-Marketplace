import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Message from '../Notify/Message';
import CustomerService from '../../Services/CustomerService';
import './EachProduct.css'
import { Slide , Fade, Zoom} from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

const EachProduct = props => {


    const [message, setMessage] = useState(null);

    const handleAddToCart = () => {
        let item = {
            productId: props.product._id,
            quantity: 1,
            suggestion: ""
        }
        CustomerService.addToCart(item).then(data => {
            const { message } = data;
            setMessage(message);
        });
    }

    const imgPath = "/uploads/" + props.product._id + "/";
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






    // console.log("shopname " , props.shopName);
    return (
        <div className="rowC card bg-light">
            <div className="card-body">

                {message ? <Message message={message} /> : null}
        
                <Slideshow />
                <Link to = {`/product/${props.product._id}`} >
                    <h3 className="card-title">{props.product.productName} </h3>
                </Link>
                <h5 className="card-text">Rs {props.product.price}/-</h5>
                <p className="card-text">{props.product.aboutProduct}</p>

                <button className="btn bg-warning btn-outline-dark" onClick={handleAddToCart}>Add to Cart</button>

            </div>
        </div>
    )
}

export default EachProduct;