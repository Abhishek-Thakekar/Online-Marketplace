import React, { useState, useContext, useRef, useEffect } from 'react';
import CustomerService from '../../Services/CustomerService';
import { AuthContext } from '../../Context/AuthContext';
import Message from '../Notify/Message';
import MyOrdersChild from './MyOrdersChild';


const MyOrders = props => {

    const { user } = useContext(AuthContext);
    // const { transactions } = user;

    const delivered = [];
    const notDelivered = [];

    // const [myBags,setMyBags] = useState([]);
    const [message, setMessage] = useState(null);
    const [orders , setOrders] = useState([]);



    useEffect(() => {

        // if (Array.isArray(user.transactions) && user.transactions.length) {
        //     user.transactions.forEach(element => {
        //         element.isDelivered === "true"
        //             ? delivered.push(element)
        //             : notDelivered.push(element)
        //     })
        // }
        // console.log("useEffect in myorders.js" , notDelivered.length);

        CustomerService.getOrders().then(data =>{
            console.log("orders => ",data);
            setOrders(data.data);
        })
        //     console.log("props history in mybag : " ,props.history);
    }, []);



    return (
        <div>
            {message ? <Message message={message} /> : null}

            <h1>Your Orders</h1>
            <hr />
          
            <ul className="list-group">
                {

                    (Array.isArray(orders) && orders.length) ?
                        orders.map(transaction => {
                            return <MyOrdersChild
                                // history = {props.history}
                                key={transaction._id}
                                transaction={transaction}
                            />
                        })
                        : <p>Nothing to show</p>
                }
            </ul>
            

        </div>
    );
}



export default MyOrders;
