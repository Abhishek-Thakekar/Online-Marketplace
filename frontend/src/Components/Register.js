import React, {useState,useRef,useEffect} from 'react';
import AuthService from '../Services/AuthService';
import Message from '../Components/Message';
import GoogleLogin from 'react-google-login'


const Register = props=>{
    const [user,setUser] = useState({
                username: "", email:"", password : "",firstname:"", lastname:"",
                isOwner:false , profile:"", city:"" , address:"" ,role : "user",
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
            isOwner:false , profile:"", city:"" , address:"" ,role : "user",shopName:"noShop"
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
        <div>
            <form onSubmit={onSubmit}>
                <h3>Please Register</h3>
                <label htmlFor="username" className="sr-only">Username: </label>
                <input  type="text" 
                       name="username" 
                       value={user.username}
                       onChange={onChange} 
                       className="form-control" 
                       placeholder="Enter Username"/>

                <label htmlFor="email" className="sr-only">Email: </label>
                <input readOnly type="text" 
                       name="email" 
                       value={user.email}
                       onChange={onChange} 
                       className="form-control" 
                       placeholder="Add & Verify Gmail from below"/>

                <label htmlFor="password" className="sr-only">Password: </label>
                <input type="password" 
                       name="password"
                       value={user.password} 
                       onChange={onChange} 
                       className="form-control" 
                       placeholder="Enter Password"/>


<label htmlFor="firstName" className="sr-only">firstName: </label>
                <input type="text" 
                       name="firstname"
                       value={user.firstName}  
                       onChange={onChange} 
                       className="form-control" 
                       placeholder="Enter firstName"/>

<label htmlFor="lastName" className="sr-only">lastName: </label>
                <input type="text" 
                       name="lastname"
                       value={user.lastName}  
                       onChange={onChange} 
                       className="form-control" 
                       placeholder="Enter lastName "/>

<label htmlFor="city" className="sr-only">city: </label>
                <input type="text" 
                       name="city"
                       value={user.city}  
                       onChange={onChange} 
                       className="form-control" 
                       placeholder="Enter city "/>

<label htmlFor="address" className="sr-only">address: </label>
                <input type="text" 
                       name="address"
                       value={user.address}  
                       onChange={onChange} 
                       className="form-control" 
                       placeholder="Enter address "/>




                <button className="btn btn-lg btn-primary btn-block" 
                        type="submit">Register</button>

                <button className="btn btn-lg btn-primary btn-block" 
                        type="reset"  onClick={resetForm}>Reset</button>
            </form>

        <div>
            <h4>Verify and add your gmail from here</h4>
            <GoogleLogin 
            clientId = "756272229800-uauh8h5974nv2gm3kf5rmmat9rqg01d6.apps.googleusercontent.com"
            buttonText = "Register"
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