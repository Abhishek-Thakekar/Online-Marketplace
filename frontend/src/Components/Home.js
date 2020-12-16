import React, {useState,useContext,useEffect} from 'react';
import AuthService from '../Services/AuthService';
import Message from './Message';
import { AuthContext } from '../Context/AuthContext';
// import {Link} from 'react-router-dom';



const Home = (props)=>{
    
    const authContext = useContext(AuthContext);
    const {user , setUser , isAuthenticated ,setIsAuthenticated} = useContext(AuthContext);

    const handleLogOut = e =>{
        e.preventDefault();
        AuthService.logout().then(data=>{
            console.log("inside logout", data);
            const {success, user} = data;

            if(success){
                setUser(user);
                setIsAuthenticated(false);
                props.history.push('/');
            }
        });
    }
    
    

    return(
        <div>
            <h1>Shops</h1>
            <button className="btn btn-lg btn-primary btn-block" onClick={handleLogOut}>Log Out</button>
            <br/>

        </div>
    );

}

export default Home;