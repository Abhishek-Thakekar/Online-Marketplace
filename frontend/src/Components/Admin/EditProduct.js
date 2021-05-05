import React, { useState, useRef, useEffect } from 'react';
import AdminService from '../../Services/AdminService';
import Message from '../Notify/Message';


const EditProduct = props => {

    const [product, setProduct] = useState({
        productName: "", price: null, description: "", availability: null,
        category: ""
    });
    const [productImage, setProductImage] = useState([]);
    const [message, setMessage] = useState(null);

    let timerID = useRef(null);

    useEffect(() => {

        if (!props.location.productId)
            props.history.push('/admin');

        AdminService.getEditProduct(props.location.productId).then(data => {
            const { message } = data;
            setMessage(message);
            fillForm(data.product);
        });

        // console.log("  pathname : ", props.location.pathname)
        // console.log("params : ", props.match.params);
        // console.log("location in path : ", props.location);

        return () => {
            clearTimeout(timerID);
        }
    }, []);

    const onChange = e => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    }

    const onFileChange = e => {
        setProductImage(e.target.files);
    }

    const fillForm = (data) => {
        setProduct(data);
    }

    const resetForm = () => {
        setProduct({
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
        const formData = new FormData();
    
        for (let i = 0; i < productImage.length; i++) {
            console.log("file info => ", productImage[i]);
            formData.append(`myFile`, productImage[i]);
        }
        formData.append("productName", product.productName.trim());
        formData.append("price", product.price);
        formData.append("description", product.description);
        formData.append("availability", product.availability);
        formData.append("category", product.category);
        formData.append("productId", props.location.productId);
        
        AdminService.updateEditProduct(formData).then(data => {
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
            <h3 className="page-title mt-3">Edit Product</h3>
            <form onSubmit={onSubmit}>

                <input type="text"  className="input-text  mt-3" onChange={onChange} name="productName"
                   placeholder="Enter product name"/>
                <br/>

                <label htmlFor="productImage" className="btn bg-warning mt-3">
                    Upload <i className="fas fa-upload"></i>
                </label>
                <input type="file"  multiple accept="image/*" id="productImage"
                       onChange={onChange} name="myFile"
                       placeholder="Enter product Image"/>
                <br/>

                <input type="number"  className="input-text  mt-3" onChange={onChange} name="price"
                   placeholder="Enter product price"/>
                <br/>

                <input type="number"  className="input-text  mt-3" onChange={onChange} name="availability"
                   placeholder="Enter product availability"/>
                <br/>

                <input type="number"  className="input-text  mt-3" onChange={onChange} name="description"
                   placeholder="Tell customers about this product"/>
                <br/>

                <input type="text"  className="input-text  mt-3" onChange={onChange} name="category"
                   placeholder="Category"/>
                <br/>
                
                <button className="btn btn-warning mt-4 mr-3" 
                    type="submit">Update product</button>

                <button className="btn btn-warning mt-4"
                    onClick={resetForm} type="reset">Reset <i className="fas fa-undo"></i></button>

            </form>
            {message ? <Message message={message} /> : null}
        </div>
    );
}


export default EditProduct;
