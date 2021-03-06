import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Message from '../Notify/Message';
import './EachProduct.css';
import CustomerService from '../../Services/CustomerService';
import { Zoom } from "react-slideshow-image";
import 'react-slideshow-image/dist/styles.css';



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
    let arr = [1, 2, 3];

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
                            <img key={element}  src={newPath} onError={(e) => { e.target.src = '/blank.jpg' }} />

                        )
                    })
                    }
                </Zoom>
            </div>
        );
    };






    // console.log("shopname " , props.shopName);
    return (
        <div id="rowC">
            {message ? <Message message={message} /> : null}

            {/* <li> */}
                <div className="App">
                    <Slideshow />
                </div>
                {
                    // arr.map(element => {
                    //     let newPath = imgPath + element + ".jpg"
                    //     return (
                    //         <img id="img1" src={newPath} onError={(e) => { e.target.src = '/blank.jpg' }} />

                    //     )
                    //     {/* return <img id="img1" src={newPath} onError={(e) => { e.target.src = '/blank.jpg' }} /> */ }
                    // })
                }



                {/* <img id="img1" src={imgPath} alt="skate board"></img> */}
                <h1> {props.product.productName} </h1>
                <h3>{props.product.price}</h3>
                <h5>{props.product.aboutProduct}</h5>
            {/* </li> */}

            <button onClick={handleAddToCart}>Add to Cart</button>

            <hr />
        </div>
    )
}

export default EachProduct;