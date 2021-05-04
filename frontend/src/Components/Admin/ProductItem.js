import React , {useState} from 'react';
import { Link } from 'react-router-dom';
import Message from '../Notify/Message';
import AdminService from '../../Services/AdminService';
//import './ProductItem.css'
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
                            <img className="card-img-top" key={element}  src={newPath} onError={(e) => { e.target.src = '/blank.jpg' }} />

                        )
                    })
                    }
                </Zoom>
            </div>
        );
    };

    return (
        <div className="rowC card bg-light">
            <div className="card-body">
                
                {message ? <Message message={message} /> : null}
            
                <Slideshow />
                <h3 className="card-title">{props.product.productName} </h3>
                <h5 className="card-text">Rs {window.numberWithCommas(props.product.price)}/-</h5>

            <Link to={editProduct}>
                <button className="btn bg-warning btn-outline-dark mr-2" onClick={handleEdit}>Edit</button>
            </Link>

            <Link to={deleteProduct}>
                <button className="btn bg-warning btn-outline-dark" onClick={handleDelete}>Delete</button>
            </Link>
            </div>
        </div>
    )
}

export default ProductItem;