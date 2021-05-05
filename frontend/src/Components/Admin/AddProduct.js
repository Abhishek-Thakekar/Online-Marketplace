import React, { useState, useEffect, useRef } from 'react';
import AdminService from '../../Services/AdminService';
import Message from '../Notify/Message';



const AddProduct = (props) => {


    const [product, setProduct] = useState({
        productName: "", price: null, description: "", availability: null,
        category: ""
    });
    const [message, setMessage] = useState(null);

    let timerID = useRef(null);

    useEffect(() => {

        return () => {
            clearTimeout(timerID);
        }
    }, []);

    const onChange = e => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    }

    const resetForm = () => {
        setProduct({
            ...product,
            productName: "", price: null, description: "", availability: null,
            category: ""
        });
    }

    const onSubmit = e => {
        e.preventDefault();
        if(!product.productName || !product.price || !product.availability || !product.category){
            alert("fill everything");
            return;
        }
        setProduct({ ...product, productName: product.productName.trim() });
        // let newobj = product;
        // newobj.productName = newobj.productName.trim();
        // console.log("on creating product : ", newobj);

        AdminService.addProduct(product).then(data => {
            const { message } = data;
            setMessage(message);
            if (!message.msgError) {
                resetForm();
                timerID = setTimeout(() => {
                    props.history.push('/admin');
                }, 2000)
            }
        });
    }

    return (
        <div className="body-div">
            <h1 className="page-title">Add Product</h1>
            <form onSubmit={onSubmit}>

                {/*<label htmlFor="productName" className="sr-only">productName: </label>
                <input type="text"
                    name="productName"
                    value={product.productName}
                    onChange={onChange}
                    className="form-control"
    placeholder="Enter product name " />*/}
                <input type="text"  className="input-text  mt-3" onChange={onChange} name="productName"
                   placeholder="Enter product name"/>
                <br/>

                <input type="text"  className="input-text  mt-3" onChange={onChange} name="category"
                   placeholder="Enter category name"/>
                <br/>

                <input type="number"  className="input-text  mt-3" onChange={onChange} name="price"
                   placeholder="Enter product price"/>
                <br/>

                <input type="number"  className="input-text  mt-3" onChange={onChange} name="availability"
                   placeholder="Enter product availability"/>
                <br/>

                <input type="text"  className="input-text  mt-3" onChange={onChange} name="description"
                   placeholder="Tell customers about this product"/>
                <br/>
                
                <button className="btn  btn-warning mt-4 mr-3 btn-outline-dark"
                    type="submit">Save and Create <i className="fas fa-save"></i></button>

                <button className="btn btn-warning mt-4 btn-outline-dark"
                    onClick={resetForm} type="reset">Reset <i className="fas fa-undo"></i></button>

            </form>
            {message ? <Message message={message} /> : null}
        </div>
    );
}


export default AddProduct;