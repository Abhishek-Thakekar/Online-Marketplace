import React, {useState,useContext,useEffect} from 'react';
import AuthService from '../Services/AuthService';
import Message from './Message';
import { AuthContext } from '../Context/AuthContext';
// import {Link} from 'react-router-dom';



const Home = (props)=>{
    
    const authContext = useContext(AuthContext);
    const {user , setUser , isAuthenticated ,setIsAuthenticated} = useContext(AuthContext);

    
    
    

    return(
        <div>
            <h1>Shops</h1>
            <br/>
        </div>
    );

}

export default Home;