import React, { useState, useContext, useRef, useEffect } from 'react';
import CustomerService from '../../Services/CustomerService';
import { AuthContext } from '../../Context/AuthContext';
import MapBox from '../MapBox/MapBox';
import Message from '../Notify/Message';
// import { Link } from 'react-router-dom';


const razorPay = (src) => {
    return new Promise((resolve) => {


        const script = document.createElement('script');
        script.src = src;
        //   console.log("hi");
        script.onload = () => {
            // console.log("hey true");
            resolve(true);
        };

        //   console.log("hiii");
        script.onerror = () => {
            // console.log("heyyy false");
            resolve(false);
        }
        //   console.log("hiiiii");
        document.body.appendChild(script);
        //   console.log("hiiiiiiii");
    });
}


const Pay = props => {

    // here are 2 methods of getting MyBag data
    // 1 . through props.location from usermybagitem
    // 2 . through req.user.mybags.find(s => s.shopName === shop or s.shopId === shopId)
    // check what is better ... passing data within components and then to server 
    //                     or finding user and its mybag in server itself by passing shopId as parameter
    // 1st case : you are passing all information from frontend to backend
    // 2nd case : you are finding everything in backend using shopId
    const { user } = useContext(AuthContext);
    

    const [info, setInfo] = useState({
        paymentType: "cashOnDelivery",
        address: user.address, phone: "",
        mapAddress:"",
        latitude:null,
        longitude:null
    });

    const [flagMap , setFlagMap] = useState(false);


    const [message, setMessage] = useState(null);

    let timerID = useRef(null);




    useEffect(() => {
        if(!(props.location.pathname && props.location.products && props.location.total && user))
            props.history.push('/cart');
        // console.log("  pathname : ", props.location.pathname)
        // console.log("params : ", props.match.params);
        // console.log("mybag in pay path : ", props.location.myBag);
        return () => {
            clearTimeout(timerID);
        }
    }, []);



    const onChange = e => {
        setInfo({ ...info, [e.target.name]: e.target.value });
    }

    const mapChange = (mapObj) =>{
        setInfo({
            ...info,
            mapAddress:mapObj.mapAddress,
            latitude : mapObj.latitude,
            longitude: mapObj.longitude
        });
    }

    const resetForm = () => {
        setInfo({
            ...info,
            address: "",
            phone: "",
            mapAddress:"",
            latitude:null,
            longitude:null
        });
    }

    async function displayRazorPay(total, newObj) {

        const res = await razorPay('https://checkout.razorpay.com/v1/checkout.js');

        if (!res) {
            alert("razorpay sdk failed to load.");
            return;
        }

        // console.log("started fetch");
        let obj = {
            total: total
        }
        CustomerService.payment(obj).then(data => {

            const { message } = data;
            setMessage(message);
            console.log("razorpay data :", data);
            // });

            const options = {
                "key": "rzp_test_wZA3hIzuwQPK0P", // Enter the Key ID generated from the Dashboard
                "amount": data.response.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                "currency": data.response.currency,
                "order_id": data.response.order_id,
                "name": "Shopcart",
                "description": "Pay to place your order!",
                "image": "https://example.com/your_logo",
                // "order_id": "order_9A33XWu170gU", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                "handler": function (response) {

                    // payment cofirmation 2 methods
                    // 1 webhook in which razorpay gives you confirmation ..better way according to codedamn you tube channel
                    // 2 handler as below which is temporary.
                    console.log("handler ", response);
                    if (response.razorpay_payment_id) {
                        console.log("data obj : ", newObj);
                    }
                    alert(response.razorpay_payment_id);
                    alert(response.razorpay_order_id);
                    alert(response.razorpay_signature);
                    CustomerService.addTransaction(newObj).then(data => {
                        const { message } = data;
                        setMessage(message);
                        if (!message.msgError) {
                            resetForm();
                            timerID = setTimeout(() => {
                                props.history.push('/');
                            }, 2000)
                        }
                    });
                },
                "prefill": {
                    "name": "Mandar",
                    "email": "mandarthakekar@gmail.com",
                    "contact": "9999999999"
                },
                "notes": {
                    "address": "Razorpay Corporate Office"
                },
                "theme": {
                    "color": "#2513ed"
                }
            };
            var paymentObject = new window.Razorpay(options);
            paymentObject.open();

        });

    }

    const onSubmit = e => {
        e.preventDefault();
        if (info.address === "" || info.phone === "" || info.mapAddress==="") {
            alert("Fill total form");
        }
        else {
            // console.log("test 1");
            // console.log("user : ", user);
            const cart = props.location.products;
            console.log("props location ", cart);
            const items = [];
            // console.log("test 2");
            if (cart) {
                cart.forEach(pro => {
                    // console.log("foreach");
                    let item = {
                        productId: pro.productId._id,
                        productName : pro.productId.productName,
                        quantity: pro.quantity,
                        price: pro.productId.price,
                        suggestion: pro.suggestion,
                    }
                    items.push(item);
                });



                // console.log("test 3 user : ",user);

                let transData = {
                    items : items, total : props.location.total,
                    username: user.username, userId: user._id,
                    paymentType: info.paymentType,
                    address: info.address, mapAddress:info.mapAddress,
                    latitude:info.latitude, longitude:info.longitude,
                    isDelivered: "false", isReceived: "false",
                    phone: info.phone
                };
                let newObj = {
                    transData: transData
                }


                if (transData.paymentType === "Online") {
                    displayRazorPay(Number(transData.total), newObj);

                }
                else {
                    CustomerService.addTransaction(newObj).then(data => {
                        const { message } = data;
                        setMessage(message);
                        if (!message.msgError) {
                            resetForm();
                            timerID = setTimeout(() => {
                                props.history.push('/');
                            }, 2000)
                        }
                    });
                }
            }
            else {
                props.history.push('/cart');
            }
        }

    }


    const onCancel = e => {
        e.preventDefault();
        props.history.push('/cart');
    }

    const changeFlagMap = (e) =>{
        e.preventDefault();
        if(flagMap){
            setFlagMap(false);
        }
        else{
            setFlagMap(true);
        }
    }


    return (
        <div>
            <h1>Payment is being processed...</h1>

            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="mapAddress" className="label">Map Address: </label>
                    <input type="text"
                        readOnly
                        name="mapAddress"
                        value={info.mapAddress}
                        onChange={onChange}
                        className="form-control"
                        placeholder="Put nearby locality of delivery address" />
                        {
                        flagMap ?
                        <button onClick={changeFlagMap}>Close Map</button>
                        : <button onClick={changeFlagMap}>Open Map</button>
                        }
                </div>
                <div>
                    {
                        flagMap ?
                        <MapBox 
                            changeFlagMap={changeFlagMap} 
                            mapChange={mapChange}
                        ></MapBox>
                        : null
                    }
                </div>

                <div className="form-group">
                    <label htmlFor="address" className="label">Helping Address: </label>
                    <input type="text"
                        name="address"
                        value={info.address}
                        onChange={onChange}
                        className="form-control"
                        placeholder="Your address " />

                </div>
                <div className="form-group">
                    <label htmlFor="paymentType" className="label">Your Payment Method </label>
                    <span></span>
                    <select onChange={onChange} name="paymentType">
                        <option value="cashOnDelivery">Cash on Delivery</option>
                        <option value="Online">Online</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="phone" className="label">Contact Number </label>
                    <input type="text"
                        name="phone"
                        value={info.phone}
                        onChange={onChange}
                        className="form-control"
                        placeholder="Enter your contact number" />
                </div>
                <button className="btn  btn-primary btn-block"
                    type="submit">Next</button>

                <button className="btn  btn-danger  btn-block"
                    onClick={resetForm} type="reset">Reset Info</button>

            </form>
            <br>
            </br>
            {message ? <Message message={message} /> : null}

            {/* <div>
                <button className="btn  btn-primary  btn-block"
                    onClick={displayRazorPay} >
                        Razorpay
                </button>
            </div> */}

            <br></br>
            <div>
                <button className="btn  btn-danger  btn-block"
                    onClick={onCancel} >Cancel</button>
            </div>

        </div >
    )
}



export default Pay;
