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
        <div>
            <form onSubmit={onSubmit}>
                <label htmlFor="productName" className="sr-only">productName: </label>
                <input type="text"
                    name="productName"
                    value={product.productName}
                    onChange={onChange}
                    className="form-control"
                    placeholder="Enter product name " />

                <label htmlFor="productImage" className="sr-only">productImage: </label>
                <input type="file" multiple
                    name="myFile"
                    onChange={onFileChange}
                    className="form-control"
                    placeholder="Enter product image " />

                <label htmlFor="price" className="sr-only">productPrice: </label>
                <input type="number"
                    name="price"
                    value={product.price}
                    onChange={onChange}
                    className="form-control"
                    placeholder="Enter product price " />

                <label htmlFor="availability" className="sr-only">product availability: </label>
                <input type="number"
                    name="availability"
                    value={product.availability}
                    onChange={onChange}
                    className="form-control"
                    placeholder="Enter product availability " />

                <label htmlFor="description" className="sr-only">Description</label>
                <input type="text"
                    name="description"
                    value={product.description}
                    onChange={onChange}
                    className="form-control"
                    placeholder="Tell customers about this product" />

                <label htmlFor="category" className="sr-only">category</label>
                <input type="text"
                    name="category"
                    value={product.category}
                    onChange={onChange}
                    className="form-control"
                    placeholder="Tell customers about this product" />
                
                <button className="btn btn-lg btn-primary btn-block"
                    type="submit">Update product</button>

                <button className="btn btn-lg btn-primary btn-block"
                    onClick={resetForm} type="reset">Reset</button>

            </form>
            {message ? <Message message={message} /> : null}
        </div>
    );
}


export default EditProduct;
