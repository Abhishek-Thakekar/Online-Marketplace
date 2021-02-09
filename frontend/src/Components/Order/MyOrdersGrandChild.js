import React, { useState, useContext, useRef, useEffect } from "react";
// import { Link } from "react-router-dom";
import Message from '../Notify/Message';




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
        <React.Fragment>
            <tr>
                <td> {props.item.productName} </td>
                <td> {props.item.price}</td>
                <td>{props.item.quantity}</td>
                <td>{props.item.suggest}</td>
                <td>
                    ...
                </td>

            </tr>
            <div>
                {message ? <Message message={message} /> : null}
            </div>
        </React.Fragment>
    );
};

export default MyOrdersGrandChild;
