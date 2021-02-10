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
        <div>
            <form onSubmit={onSubmit}>

                <label htmlFor="productName" className="sr-only">productName: </label>
                <input type="text"
                    name="productName"
                    value={product.productName}
                    onChange={onChange}
                    className="form-control"
                    placeholder="Enter product name " />

                <label htmlFor="category" className="sr-only">category: </label>
                <input type="text"
                    name="category"
                    value={product.category}
                    onChange={onChange}
                    className="form-control"
                    placeholder="Enter category name " />
                {/* <label htmlFor="productImage" className="sr-only">productImage: </label>
                <input type="file"
                    name="productImage"
                    value={product.productImage}
                    onChange={onChange}
                    className="form-control"
                    placeholder="Enter product image " /> */}

                <label htmlFor="price" className="sr-only">productPrice: </label>
                <input type="number"
                    name="price"
                    value={product.price}
                    onChange={onChange}
                    className="form-control"
                    placeholder="Enter product price " />

                <label htmlFor="availability" className="sr-only">availability: </label>
                <input type="number"
                    name="availability"
                    value={product.availability}
                    onChange={onChange}
                    className="form-control"
                    placeholder="Enter product availability " />


                <label htmlFor="description" className="sr-only">product description: </label>
                <input type="text"
                    name="description"
                    value={product.description}
                    onChange={onChange}
                    className="form-control"
                    placeholder="Tell customers about this product" />

                <button className="btn btn-lg btn-primary btn-block"
                    type="submit">Save and Create</button>

                <button className="btn btn-lg btn-primary btn-block"
                    onClick={resetForm} type="reset">Reset</button>

            </form>
            {message ? <Message message={message} /> : null}
        </div>
    );
}


export default AddProduct;