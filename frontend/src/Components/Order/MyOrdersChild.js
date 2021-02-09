import React, { useState, useContext, useRef, useEffect } from 'react';
// import CustomerService from '../../Services/CustomerService';
// import { AuthContext } from '../../Context/AuthContext';
import Message from '../Notify/Message';
import MyOrdersGrandChild from './MyOrdersGrandChild';


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
        // let newObj = {
        //     date : props.transaction.date , 
        //     userId : props.transaction.userId
        // };
        // TransactionService.isReceived(newObj).then(data =>{
        //     const {message} = data;
        //     setMessage(message);
        // });

    }


    return (
        <div>
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
                            return <MyOrdersGrandChild
                                key={item._id}
                                item={item}
                                // history={props.history}
                            />
                        })
                        : <p>Nothing to show</p>
                }
            </table>
            <h3>total : {props.transaction.total}</h3>
            <h5>Address : {props.transaction.address}</h5>
            {
                props.transaction.isDelivered === "true"
                    ? <React.Fragment>
                        Order has been delivered =&gt;
                        {
                            flag ?
                            <h5>Order Received. Done with shopping.</h5>
                            :<button onClick={onReceived}>Click if Order Received ?</button>

                        }
                    </React.Fragment>
                    : <React.Fragment>
                        Order has not been delivered =&gt;
                        <button>Cancel Order</button>
                    </React.Fragment>
            }
     
            {/* </Link> */}

            <hr />
            {message ? <Message message={message} /> : null}
            <hr />
        </div>
    );
};

export default MyOrdersChild;
