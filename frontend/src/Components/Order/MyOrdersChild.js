import React, { useState, useContext, useRef, useEffect } from 'react';
import CustomerService from '../../Services/CustomerService';
// import { AuthContext } from '../../Context/AuthContext';
import Message from '../Notify/Message';
import MyOrdersGrandChild from './MyOrdersGrandChild';
import { Slide , Fade, Zoom} from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

const zoomOutProperties = {
    transitionDuration: 300,
    infinite: false,
    indicators: true,
    scale: 0.4,
    arrows: true
};

const MyOrdersChild = (props) => {

    const [message, setMessage] = useState(null);
    const [flag, setFlag] = useState(false);

    let timerID = useRef(null);

    useEffect(() => {
        if(props.transaction.isReceived !== "false"){
            setFlag(true);
        }
        return () => {
            clearTimeout(timerID);
        }
    }, []);


    const onReceived = e => {
        e.preventDefault();
        setFlag(true);
        let newObj = {
            orderId: props.transaction._id
        };
        CustomerService.isReceived(newObj).then(data => {
            const { message } = data;
            setMessage(message);
        });

    }


    return (
        <div className="rowOrder card bg-light">
            <div className="card-body">
            <div className="slide-container mr-4">
                <Slide {...zoomOutProperties}>   
                {
                    (Array.isArray(props.transaction.items) && props.transaction.items.length) ?
                        props.transaction.items.map(item => {
                            return <MyOrdersGrandChild
                                key={item._id}
                                item={item}
                                // history={props.history}
                            />
                        })
                        : <p>Nothing to show</p>
                }
                </Slide>
            </div>
            <h3>Total Order Price - Rs.{props.transaction.total}/-</h3>
            <h5>Address : {props.transaction.address}</h5>
            {
                props.transaction.isDelivered === "true"
                    ? <React.Fragment>
                        Order has been delivered -&gt;
                        {
                            flag ?
                            <h5>Order Received. Done with shopping.</h5>
                            :<button className="btn bg-warning btn-outline-dark rounded-sm ml-2"  onClick={onReceived}>Click if Order Received ?</button>

                        }
                    </React.Fragment>
                    : <React.Fragment>
                        Order has not been delivered -&gt;
                        <button className="btn bg-warning btn-outline-dark rounded-sm ml-2" >Cancel Order</button>
                    </React.Fragment>
            }
     
            {message ? <Message message={message} /> : null}
            </div>
        </div>
    );
};

export default MyOrdersChild;
