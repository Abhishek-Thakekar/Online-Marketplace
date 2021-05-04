import React, {useState,useRef,useEffect} from 'react';
import AuthService from '../../Services/AuthService';
import Message from '../Notify/Message';
import GoogleLogin from 'react-google-login'
import './Register.css'

const Register = props=>{
    const [user,setUser] = useState({
                username: "", email:"", password : "",firstname:"", lastname:"",
                profile:"", address:"" ,role : "user",
                                    });
    const [message,setMessage] = useState(null);
    let timerID = useRef(null);

    useEffect(()=>{
        return ()=>{
            clearTimeout(timerID);
        }
    },[]);

    const onChange = e =>{
        setUser({...user,[e.target.name] : e.target.value});
    }

    const resetForm = ()=>{
        setUser({
            username: "", email:"", password : "",firstname:"", lastname:"",
            profile:"",  address:"" ,role : "user"                               
        });
    }

    const onSubmit = e =>{
        e.preventDefault();
        setUser({...user, username : user.username.trim()});
        console.log("onsubmit : ",user);
        AuthService.register(user).then(data=>{
            const { message } = data;
            setMessage(message);
            if(!message.msgError){
                resetForm();
                timerID = setTimeout(()=>{
                    props.history.push('/login');
                },2000)
            }
        });
    }

    var guser=null;
    const responseGoogle = (response) =>{
        console.log('response :- ', response);
        console.log('profileobj :-',response.profileObj);
        guser = response.profileObj;
        if(guser){
          console.log('image :-' , guser.imageUrl);
          setUser({
              ...user,
              email : guser.email,
              profile : guser.imageUrl
            });
        }
          else{
          console.log("user didn`t log in")
        }
    }


    return(
        <div className="body-div">
            <form onSubmit={onSubmit}>
                <h3 className="page-title">Register</h3>

                <input type="text"  className="input-text  mt-3" onChange={onChange} name="username"
                   placeholder="Enter username"/>
                <br/>

                <input readOnly type="text"  className="input-text  mt-3" onChange={onChange} name="email"
                   placeholder="Add & Verify Gmail from below"/>
                <br/>

                <input type="password"  className="input-text  mt-3" onChange={onChange} name="password"
                   placeholder="Enter Password"/>
                <br/>

                <input type="text"  className="input-text  mt-3" onChange={onChange} name="firstname"
                   placeholder="Enter firstname"/>
                <br/>


                <input type="text"  className="input-text  mt-3" onChange={onChange} name="lastname"
                   placeholder="Enter lastname"/>
                <br/>

                <input type="text"  className="input-text  mt-3" onChange={onChange} name="address"
                   placeholder="Enter address"/>
                <br/>

                <button className="btn btn-warning  mt-4 mr-3" 
                        type="submit">Register</button>

                <button className="btn btn-warning mt-4" 
                        type="reset"  onClick={resetForm}>Reset</button>
            </form>

        <div>
            <h4 className="page-title mt-3  ">Verify Your Email -</h4>
            <GoogleLogin className="bg-warning text-dark border-light rounded google-btn"
            clientId = "756272229800-uauh8h5974nv2gm3kf5rmmat9rqg01d6.apps.googleusercontent.com"
            buttonText = "Verify"
            onSuccess = {responseGoogle}
            onFailure = {responseGoogle}
            cookiePolicy = {'single_host_origin'}>
            </GoogleLogin>
        </div>
            {message ? <Message message={message}/> : null}
        </div>
    )
}

export default Register;