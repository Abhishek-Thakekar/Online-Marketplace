import React from 'react';
import { Link } from 'react-router-dom';

const ProductItem = props => {

    const deleteProduct = {
        pathname: '/deleteProduct',
        productId: ""
    }

    const handleDelete = () => {
        deleteProduct.productId = props.product._id;
    }

    const editProduct = {
        pathname: '/editProduct',
        productId: ""
    }

    const handleEdit = () => {
        editProduct.productId = props.product._id;
    }

    // const imgPath = "/images/" +props.shopName  + "/" +props.category._id+".jpg";
    // console.log("shopname " , props.shopName);
    return (
        <div >

            <li>
                {/* <img id="img1" src={imgPath} onError={(e)=>{e.target.src='/images/blank.jpg'}}/> */}
                {/* <img id="img1" src="/manali.jpg" alt="skate board"></img> */}
                <h1> {props.product.productName} </h1>
                <h5>{props.product.aboutProduct}</h5>
            </li>

            <Link to={editProduct}>
                <button onClick={handleEdit}>Edit</button>
            </Link>

            <Link to={deleteProduct}>
                <button onClick={handleDelete}>Delete</button>
            </Link>
            <hr />
        </div>
    )
}

export default ProductItem;