
export default {

    login : (user) =>{
        return fetch('/user/login',
        {
            method : "post",
            body : JSON.stringify(user),
            headers : {
                'Content-Type' : 'application/json'
            },
            credentials: "include"
        }).then(res => {console.log(res.status);
            if(res.status !== 401)
                return res.json().then(data => data);
            else
                return { isAuthenticated : false,message : {msgBody : "Incorrect username or password", msgError: true}, user : null};
            })
    },

    register : user =>{
        return fetch('/user/register',{
            method : "post",
            body : JSON.stringify(user),
            headers : {
                'Content-Type' : 'application/json'
            },
            credentials: "include"
        }).then(res => res.json())
          .then(data => data);
    },

    logout : ()=>{
        return fetch('/user/logout', {credentials: "include"})
                .then(res => res.json())
                .then(data => data);
    },
    
    isAuthenticated : ()=>{
        return fetch('/user/authenticated', {credentials: "include"})
                .then(res=>{
                    if(res.status !== 401)
                        return res.json().then(data => data);
                    else
                        return { isAuthenticated : false, user : null};
                });
    }

}
