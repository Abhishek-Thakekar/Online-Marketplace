import React , {useState} from 'react';
import { Link } from 'react-router-dom';
import Message from '../Notify/Message';
import AdminService from '../../Services/AdminService';
import './ProductItem.css'
import { Slide , Fade, Zoom} from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

const ProductItem = props => {
    const [message, setMessage] = useState(null);

    const deleteProduct = {
        pathname: '/deleteProduct',
        productId: ""
    }
    
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

    const imgPath = "/uploads/" + props.product._id + "/";
    let arr = [0, 1, 2];

    const zoomOutProperties = {
        duration: 3000,
        transitionDuration: 500,
        infinite: true,
        indicators: true,
        scale: 0.4,
        arrows: true
    };

    const Slideshow = () => {
        return (
            <div className="slide-container" >
                <Zoom {...zoomOutProperties}>
                    {
                    arr.map(element => {
                        let newPath = imgPath + element + ".jpg"
                        return (
                            <img key={element}  src={newPath} onError={(e) => { e.target.src = '/blank.jpg' }} />

                        )
                    })
                    }
                </Zoom>
            </div>
        );
    };

    return (
        <div id="rowC">
            {message ? <Message message={message} /> : null}
            
            <div className="App">
                <Slideshow />
            </div>
            <li>
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