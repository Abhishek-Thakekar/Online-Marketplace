import React, { useState, useContext, useRef, useEffect } from "react";
// import { Link } from "react-router-dom";
import CustomerService from '../../Services/CustomerService';
import Message from '../Notify/Message';
import { Link } from 'react-router-dom';
import { Slide , Fade, Zoom} from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import './EachCartProduct.css'


const EachCartProduct = props => {

    const [flag, setFlag] = useState(false);
    const [message, setMessage] = useState(null);

    const [item, setItem] = useState({
        quantity: props.product.quantity,
        price: props.product.productId.price,
        suggestion: props.product.suggestion
    });

    let timerID = useRef(null);

    useEffect(() => {
        return () => {
            clearTimeout(timerID);
        }
    }, []);

    
    const imgPath = "/uploads/" + props.product.productId._id + "/";
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
                            <img className="card-img-top" key={element}  src={newPath} onError={(e) => { e.target.src = '/blank.jpg' }} />

                        )
                    })
                    }
                </Zoom>
            </div>
        );
    };

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
            <div className="rowCart card bg-light mb-3">
                <div className="card-body">
                    {message ? <Message message={message} /> : null}

                    <Slideshow />
                    <Link to = {`/product/${props.product.productId._id}`} >
                    <h3 className="card-title">{props.product.productId.productName}</h3>
                    </Link>
                    <h5 className="card-text">Price - Rs {Number(item.price) * Number(item.quantity)}/-</h5>
                    <div className="quantity-div">
                    <span className="card-text mr-3">Quantity - {item.quantity}</span>
                    {
                        flag ?
                            <span className="quantity-buttons">
                                <button className="btn bg-warning btn-outline-dark rounded-sm mr-2" onClick={onIncrement}>+</button>
                                <button className="btn bg-warning btn-outline-dark rounded-sm" onClick={onDecrement}>-</button>
                            </span>
                            : null
                    } 
                    </div>
                    {/*
                        flag ?
                            <textarea className="mt-2 mb-2" name="suggestion" onChange={onSuggest}>{item.suggestion}</textarea>
                            : item.suggestion
                    */}
                    <br/>
                    {
                        flag ?
                            <React.Fragment>
                                <form onSubmit={onDone}>
                                    <button className="btn bg-warning btn-outline-dark mr-2" type="submit">
                                        <i className="fas fa-check"></i></button> 
                                    <button className="btn bg-warning btn-outline-dark" onClick={onCancel}>
                                        <i className="fas fa-times"></i></button>
                                </form>
                            </React.Fragment>
                            : <button className="btn bg-warning btn-outline-dark" onClick={onEdit}>
                                <i className="fas fa-edit"></i> </button>
                    }
                </div>
            </div>
    );
};

export default EachCartProduct;


