import React , {useState} from 'react';
import { Link } from 'react-router-dom';
import Message from '../Notify/Message';
import AdminService from '../../Services/AdminService';

const ProductItem = props => {

    const deleteProduct = {
        pathname: '/deleteProduct',
        productId: ""
    }
    const [message, setMessage] = useState(null);

    const handleDelete = () => {
        // deleteProduct.productId = props.product._id;
        AdminService.deleteProduct(props.product._id).then(data => {
            const { message } = data;
            setMessage(message);
        });
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
            {message ? <Message message={message} /> : null}

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