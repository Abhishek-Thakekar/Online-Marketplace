import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Message from '../Notify/Message';
import './EachProduct.css';
import CustomerService from '../../Services/CustomerService';

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

    var slideIndex = 0;

    function showSlides() {
        var i;
        var slides = document.getElementsByClassName("mySlides");
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slideIndex++;
        if (slideIndex > slides.length) { slideIndex = 1 }
        
        slides[slideIndex - 1].style.display = "block";
        setTimeout(showSlides, 2000); // Change image every 2 seconds
    }

    showSlides();

    // console.log("shopname " , props.shopName);
    return (
        <div >
            {message ? <Message message={message} /> : null}

            <li>
                <div class="slideshow-container">
                    {
                        arr.map(element => {
                            let newPath = imgPath + element + ".jpg"
                            return (
                                <div class="mySlides fade">
                                    <div class="numbertext">element / 3</div>
                                    <img id="img1" src={newPath} onError={(e) => { e.target.src = '/blank.jpg' }} />
                                </div>
                            )
                            {/* return <img id="img1" src={newPath} onError={(e) => { e.target.src = '/blank.jpg' }} /> */ }
                        })
                    }
                </div>


                {/* <img id="img1" src={imgPath} alt="skate board"></img> */}
                <h1> {props.product.productName} </h1>
                <h3>{props.product.price}</h3>
                <h5>{props.product.aboutProduct}</h5>
            </li>

            <button onClick={handleAddToCart}>Add to Cart</button>

            <hr />
        </div>
    )
}

export default EachProduct;