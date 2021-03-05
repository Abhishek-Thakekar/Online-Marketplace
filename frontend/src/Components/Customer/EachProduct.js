import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Message from '../Notify/Message';
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



    // const imgPath = "/images/" +props.shopName  + "/" +props.category._id+".jpg";
    // console.log("shopname " , props.shopName);
    return (
        <div >
            {message ? <Message message={message} /> : null}

            <li>
                {/* <img id="img1" src={imgPath} onError={(e)=>{e.target.src='/images/blank.jpg'}}/> */}
                {/* <img id="img1" src="/manali.jpg" alt="skate board"></img> */}
                {

                }
                <h1> {props.product.productName} </h1>
                <h3>{props.product.price}</h3>
                <h5>{props.product.aboutProduct}</h5>
            </li>
            {
                [1,2,3].map((el) => {
                    return <img src={`/../../../../backend/uploads/${props.product._id}/${el}.jpg`}/>
                })
            }
            <button onClick={handleAddToCart}>Add to Cart</button>

            <hr />
        </div>
    )
}

export default EachProduct;