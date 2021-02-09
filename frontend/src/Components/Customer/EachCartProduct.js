import React, { useState, useContext, useRef, useEffect } from "react";
// import { Link } from "react-router-dom";
import CustomerService from '../../Services/CustomerService';
import Message from '../Notify/Message';




const EachCartProduct = props => {

    const [flag, setFlag] = useState(false);
    const [message, setMessage] = useState(null);
    let timerID = useRef(null);


    useEffect(() => {
        return () => {
            clearTimeout(timerID);
        }
    }, []);

    const [item, setItem] = useState({
        quantity: props.product.quantity,
        price: props.product.productId.price,
        suggestion: props.product.suggestion
    });

    const onEdit = e => {
        e.preventDefault();
        setFlag(true);
    }

    const onDone = e => {
        e.preventDefault();
        setFlag(false);
        console.log("item after done : ", item);
        let newobj = props.product;
        newobj.suggestion = item.suggestion;
        newobj.quantity = item.quantity;
        console.log("Done Done Done !!!");

        CustomerService.updateCart(newobj).then(data => {
            const { message } = data;
            setMessage(message);
            if (!message.msgError) {
                timerID = setTimeout(() => {
                    setMessage(null);
                    window.location.reload(true);
                }, 2000);
            }
        });
    }

    const onCancel = e => {
        e.preventDefault();
        setFlag(false);
        setItem({
            quantity: props.product.quantity,
            price: props.product.productId.price,
            suggestion: props.product.suggestion
        });
    }

    const onSuggest = e => {
        e.preventDefault();
        setItem({
            ...item,
            suggestion: e.target.value
        })
    }


    const onIncrement = e => {
        e.preventDefault();
        setItem({
            ...item,
            quantity: Number(item.quantity) + 1
        })
        // console.log("props in usermybagpro increment : ", props);
        // props.checkTotal(val , 1);
    }

    const onDecrement = e => {
        e.preventDefault();
        if (item.quantity > 0) {
            // console.log("props in usermybagpro decrement : ", props.history);
            // props.checkTotal(val , -1);
            setItem({
                ...item,
                quantity: Number(item.quantity) - 1
            })
        }

    }

    return (
        <React.Fragment>
            <tr>
                <td> {props.product.productId.productName} </td>
                <td> {Number(item.price) * Number(item.quantity)}</td>
                <td>
                    {
                        flag ?
                            <React.Fragment>
                                {item.quantity}
                                <button onClick={onIncrement}>+</button>
                                <button onClick={onDecrement}>-</button>
                            </React.Fragment>
                            : item.quantity
                    }
                </td>
                <td>
                    {
                        flag ?
                            <textarea name="suggest" onChange={onSuggest}>{item.suggestion}</textarea>
                            : item.suggestion
                    }
                </td>
                <td>
                    {
                        flag ?
                            <React.Fragment>
                                <form onSubmit={onDone}>
                                    <button type="submit">Done</button> <button onClick={onCancel}>Cancel</button>
                                </form>
                            </React.Fragment>
                            : <button onClick={onEdit}>Edit</button>
                    }
                </td>

            </tr>
            <div>
                {message ? <Message message={message} /> : null}
            </div>
        </React.Fragment>
    );
};

export default EachCartProduct;


