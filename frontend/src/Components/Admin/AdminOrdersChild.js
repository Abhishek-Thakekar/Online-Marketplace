import React, { useState, useContext, useRef, useEffect } from 'react';
import AdminService from '../../Services/AdminService';
// import { AuthContext } from '../../Context/AuthContext';
import Message from '../Notify/Message';
import AdminOrdersGrandChild from './AdminOrdersGrandChild';


const AdminOrdersChild = (props) => {

    const [message, setMessage] = useState(null);
    const [flag, setFlag] = useState(false);
    // console.log("flag : ",props.transaction.isDelivered);
    let timerID = useRef(null);

    useEffect(() => {
        if (props.transaction.isDelivered !== "false") {
            setFlag(true);
        }
        return () => {
            clearTimeout(timerID);
        }
    }, []);

    const onDelivered = e => {
        e.preventDefault();
        setFlag(true);
        let newObj = {
            orderId: props.transaction._id
        };
        AdminService.isDelivered(newObj).then(data => {
            const { message } = data;
            setMessage(message);
        });

    }


    return (
        <div>
            {console.log(props.transaction)}
            <h3><span className="text-primary">Customer</span> - <span className="text-warning">{props.transaction.username}</span></h3>
            <table>
                <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Suggestions</th>
                </tr>
                {
                    (Array.isArray(props.transaction.items) && props.transaction.items.length) ?
                        props.transaction.items.map(item => {
                            return <AdminOrdersGrandChild
                                key={item._id}
                                item={item}
                            // history={props.history}
                            />
                        })
                        : <p>Nothing to show</p>
                }
            </table>
            <h3>Total Price : Rs. {props.transaction.total}/-</h3>
            <h5>Address : {props.transaction.address + " , " + props.transaction.mapAddress} </h5>
            <br/>
            {
                !flag ?
                    <React.Fragment>
                        Order has not been delivered =>
                        <br></br>
                        <button onClick={onDelivered}>Delivered ? </button>
                        <button>Cancel Order</button>
                        <br>
                        </br>
                    </React.Fragment>

                    : <React.Fragment>
                        Order has been delivered <i className="fas fa-truck text-warning"></i>
                    {

                            (props.transaction.isReceived === "true") ?
                                <h6>Order has been Received by {props.transaction.username} <i className="fas fa-check text-warning"></i></h6>
                                : <h6> Order has not been received yet</h6>
                        }
                    </React.Fragment>
            }

            {/* </Link> */}

            <hr />
            {message ? <Message message={message} /> : null}
            <hr />
        </div>
    );
};

export default AdminOrdersChild;
