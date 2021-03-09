import React from 'react';


const Message = props => {

    const getStyle = (props) =>{
        let baseClass = "btn ";
        if(props.message.msgError)
            baseClass = baseClass + "bg-danger";
        else
            baseClass = baseClass + "bg-primary";
        
        return baseClass + " text-center";
    }

    return (
        <div className={getStyle(props)} role="alert">
            {props.message.msgBody}
        </div>
    )
}



export default Message;
