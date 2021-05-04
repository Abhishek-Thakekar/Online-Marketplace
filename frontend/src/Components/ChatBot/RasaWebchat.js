import React from 'react';
import Widget from 'rasa-webchat';

const RasaWebchat = () => {
    return (
        <div>
            <h1>hii</h1>
            <Widget
                socketUrl={"http://localhost:5005"}
                socketPath={"/socket.io/"}
                customData={{ "language": "en", "userid" : "10"}} // arbitrary custom data. Stay minimal as this will be added to the socket
                title={"Title"}
                // embedded = {true}
            />
        </div>

    )
}


export default RasaWebchat;
