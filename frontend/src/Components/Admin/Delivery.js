// Leigh Halliday (you tube)
//also look <DeckGL>

import React, { useState, useEffect, useRef } from 'react';
import ReactMapGL, { Marker, Popup, GeolocateControl, NavigationControl } from 'react-map-gl';
import './Delivery.css';
import GeoCoder from "react-map-gl-geocoder";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import AdminService from '../../Services/AdminService';


function Delivery(props) {

    const showError = (error) => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
            default:
                alert("Unknown error");
        }
    }

    const [viewPort, setViewPort] = useState({
        latitude: 18.7358,
        longitude: 73.0947,
        // latitude: -122.25948,
        // latitude: 37.87221,
        zoom: 10,
        height: '90vh',
        width: '100vw'
    });
    const [selected, setSelected] = useState(null);

    const [orders, setOrders] = useState([]);

    // myMap = React.createRef();
    const myMap = useRef();

    const [currentLocation, setCurrentLocation] = useState({
        latitude: 18.7358,
        longitude: 73.0947
    });

    const [searchLocation, setSearchLocation] = useState({
        latitude: null,
        longitude: null
    });

    const showPosition = position => {
        // console.log(position);
        setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
        // let lat = 73.093596; let lng = 18.741584;
        // let lat=position.coords.latitude;   let lng=position.coords.longitude;

        // fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lat},${lng}.json?country=in&access_token=pk.eyJ1IjoidGhha2VrYXItYWJoaXNoZWsiLCJhIjoiY2s4YmN6ZzR4MDUyYzNsbnAxenlmeWpuMyJ9.H7fj6-O__SDt7Vg4vQWCNg`)
        //     .then(response => response.json())
        //     .then(data => console.log(data))
        //     .catch(error => alert(error));
    }

    const handleResult = result => {
        console.log("lat", result.result.geometry);
        console.log("lng", result.result.geometry.coordinates[1]);
        console.log(result.result.place_name);
        let mapObj = {
            mapAddress: result.result.place_name,
            latitude: result.result.geometry.coordinates[1],
            longitude: result.result.geometry.coordinates[0]
        }
    }

    const handleViewportChange = (viewport) => {
        // console.log(viewport);
        setViewPort(viewport);
    }

    // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
    const handleGeocoderViewportChange = (viewport) => {
        const geocoderDefaultOverrides = { transitionDuration: 1000 }

        // console.log("after search ", viewport);
        console.log("after search lat ", viewport.latitude );
        console.log("after search long", viewport.longitude );
        // console.log("after search ", geocoderDefaultOverrides);

        setSearchLocation({
            latitude: viewport.latitude,
            longitude: viewport.longitude
        });
        return handleViewportChange({
            ...viewport,
            ...geocoderDefaultOverrides
        })
    }



    // it is like componentDidMount
    useEffect(() => {
        AdminService.getAdminOrders().then(data => {
            console.log("data in mybag: ", data.data);
            if (data && data.data) {
                setOrders(data.data);
                // data.transactions.forEach(order => {
                //     setOrders([...orders, order]);
                // });
            }
            // console.log("orders : ",orders);
        });

        if (navigator.geolocation) navigator.geolocation.getCurrentPosition(showPosition, showError);
        else alert("Problem in getting current location.");

        const listener = (e) => {
            if (e.key === "Escape") setSelected(null);
        }
        window.addEventListener("keydown", listener);
        return () => window.removeEventListener("keydown", listener);
    }, []);






    // watchPosition() - Returns the current position of the user and continues to return updated position as the user moves (like the GPS in a car).
    // clearWatch() - Stops the watchPosition() method.


    return (
        <div >
            <ReactMapGL
                ref={myMap}
                {...viewPort}
                // mapStyle='mapbox://styles/thakekar-abhishek/ckcm1u7ha17kj1jpkp1ajr5vl'
                mapStyle='mapbox://styles/mapbox/outdoors-v11'
                mapboxApiAccessToken='pk.eyJ1IjoidGhha2VrYXItYWJoaXNoZWsiLCJhIjoiY2s4YmN6ZzR4MDUyYzNsbnAxenlmeWpuMyJ9.H7fj6-O__SDt7Vg4vQWCNg'
                onViewportChange={handleViewportChange}
            // onViewportChange={view => {
            //     // console.log(view);
            //     setView(view);
            // }}

            >
                <GeoCoder
                    position="top-right"
                    mapRef={myMap}
                    onResult={handleResult}
                    onError={(error) => console.log("errpr geocoder", error)}
                    // reverseGeocode={true}
                    // lat={currentLocation.latitude}
                    // lon={currentLocation.longitude}
                    // placeholder= 'Search for places in Berkeley'// Placeholder text for the search bar
                    // bbox={ [-122.30937, 37.84214, -122.23715, 37.89838]} // Boundary for Berkeley
                    // proximity= {{
                    //   longitude: -122.25948,
                    //   latitude: 37.87221
                    // }} // Coordinates of UC Berkeley
                    onResults={(results)=>console.log(results)}
                    onViewportChange={handleGeocoderViewportChange}
                    mapboxApiAccessToken='pk.eyJ1IjoidGhha2VrYXItYWJoaXNoZWsiLCJhIjoiY2s4YmN6ZzR4MDUyYzNsbnAxenlmeWpuMyJ9.H7fj6-O__SDt7Vg4vQWCNg'
                />

                <GeolocateControl
                    positionOptions={{ enableHighAccuracy: true }}
                    trackUserLocation={true}
                />
                {/* <NavigationControl /> */}


                <Marker
                    latitude={currentLocation.latitude}
                    longitude={currentLocation.longitude}
                >
                    <button className="marker-btn" onClick={(e) => {
                        // console.log("hi : ");
                        e.preventDefault();
                        let order = {
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                            info: "Your Current Location"
                        }
                        setSelected(order);

                    }}
                    >
                        <img src="/skateboard.svg" alt="skate board"></img>
                    </button>
                </Marker>

                <Marker
                    latitude={19.0760}
                    longitude={72.8777}
                >
                    <button className="marker-btn" onClick={(e) => {
                        console.log("hiiiieeee : ");
                        e.preventDefault();
                        let note = {
                            latitude: 19.0760,                            
                            longitude: 72.8777,
                            info: "test"
                        };
                        setSelected(note);
                    }}>
                        <img src="/skateboard.svg" alt="skate board"></img>
                    </button>
                </Marker>


                {
                    orders ?
                        orders.map(order => {
                            console.log(order);
                            console.log("order : ", order.latitude, " & ", order.longitude);
                            return (
                                <Marker
                                    key={order._id}
                                    latitude={order.latitude}
                                    longitude={order.longitude}
                                >
                                    <button className="marker-btn" onClick={(e) => {
                                        // console.log("hi : ",order.latitude);
                                        e.preventDefault();
                                        let note = {
                                            latitude: order.latitude,
                                            longitude: order.longitude,
                                            mapInfo: order
                                        };
                                        setSelected(note);
                                    }}>
                                        <img src="/skateboard.svg" alt="skate board"></img>
                                    </button>
                                </Marker>
                            )
                        })
                        : null
                }


                {
                    selected ? (
                        <Popup
                            latitude={selected.latitude}
                            longitude={selected.longitude}
                            onClose={() => {
                                setSelected(null);
                            }}
                        >
                            <h1>Information</h1>
                            {
                                selected.mapInfo ?
                                    selected.mapInfo.address
                                    : (selected.info ?
                                        selected.info : null

                                    )


                            }

                        </Popup>
                    ) : null
                }

                {
                    searchLocation.latitude && searchLocation.longitude ? (
                        <Marker
                            latitude={searchLocation.latitude}
                            longitude={searchLocation.longitude}
                        >
                            <button className="marker-btn" onClick={(e) => {
                                // console.log("hi : ",view);
                                e.preventDefault();
                                let note = {
                                    latitude: searchLocation.latitude,
                                    longitude: searchLocation.longitude,
                                    info: "Searched location"
                                };
                                setSelected(note);
                            }}>
                                <img src="/skateboard.svg" alt="skate board"></img>
                            </button>
                        </Marker>
                    ) : null

                }
            </ReactMapGL>
        </div>
    )
}

export default Delivery;
