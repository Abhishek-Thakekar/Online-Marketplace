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

    return (
        <div>
        <div className="slide-container">
        <Slide>
                    {
                        arr.map(element => {
                            let newPath = imgPath + element + ".jpg"
                            return (
                                <div className="each-slide">
                                        <img src={newPath} onError={(e) => { e.target.src = '/blank.jpg' }} />
                                </div>
                                
                            )
                            {/* return <img id="img1" src={newPath} onError={(e) => { e.target.src = '/blank.jpg' }} /> */ }
                        })
                    }

        </Slide>
        </div>
                {/* <img id="img1" src={imgPath} alt="skate board"></img> */}
                <h1> {props.product.productName} </h1>
                <h3>{props.product.price}</h3>
                <h5>{props.product.aboutProduct}</h5>

            <button onClick={handleAddToCart}>Add to Cart</button>

            <hr />
        </div>
    )
}

export default EachProduct;