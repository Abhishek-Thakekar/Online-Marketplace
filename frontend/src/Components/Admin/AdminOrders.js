import React, { useState, useEffect } from 'react';
import AdminService from '../../Services/AdminService';
import Message from '../Notify/Message';
import AdminOrdersChild from './AdminOrdersChild';
import './AdminOrders.css'

const AdminOrders = () => {

    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState(null);


    useEffect(() => {
        AdminService.getAdminOrders().then(data => {
            console.log(data.data);
            setOrders(data.data);
        });
    }, [])

    return (
        <div className="body-div">
            {message ? <Message message={message} /> : null}

            <h1 className="page-title">Your Orders</h1>
            <hr />

            <ul className="list-group">
                {

                    (Array.isArray(orders) && orders.length) ?
                        orders.map(transaction => {
                            return <AdminOrdersChild
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

export default AdminOrders;