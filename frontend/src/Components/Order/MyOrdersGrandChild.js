import React, { useState, useContext, useRef, useEffect } from "react";
// import { Link } from "react-router-dom";
import Message from '../Notify/Message';
import './MyOrders.css'

const MyOrdersGrandChild = props => {

    // const [flag, setFlag] = useState(false);
    const [message, setMessage] = useState(null);
    let timerID = useRef(null);


    useEffect(() => {
        return () => {
            clearTimeout(timerID);
        }
    }, []);


    return (
        <div className="rowOrderProduct card bg-light">
            <div className="card-body">
                <div className="order-image" >
                    <img className=""  src={`/uploads/${props.item.productId}/0.jpg`} 
                         onError={(e) => { e.target.src = '/blank.jpg' }} />
                </div>
                <h3 className="card-title">{props.item.productName}</h3>
                <h5 className="card-text">Price - Rs {props.item.price}/-</h5>
                <h5 className="card-text">Quantity - {props.item.quantity}</h5>
            </div>
            <div>
                {message ? <Message message={message} /> : null}
            </div> 
        </div>
    );
};

export default MyOrdersGrandChild;
