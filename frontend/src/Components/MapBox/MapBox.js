// Leigh Halliday (you tube)
//also look <DeckGL>

import React, { useState, useEffect, useRef } from 'react';
import ReactMapGL, { Marker, Popup, GeolocateControl, NavigationControl } from 'react-map-gl';
import './image.css';
import GeoCoder from "react-map-gl-geocoder";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

function MapBox(props) {

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
        zoom: 10,
        height: '50vh',
        width: '50vw'
    });

    // const [result, setResult] = useState({

    // })

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
        let lat = 73.093596; let lng = 18.741584;
        // let lat=position.coords.latitude;   let lng=position.coords.longitude;

        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lat},${lng}.json?country=in&access_token=pk.eyJ1IjoidGhha2VrYXItYWJoaXNoZWsiLCJhIjoiY2s4YmN6ZzR4MDUyYzNsbnAxenlmeWpuMyJ9.H7fj6-O__SDt7Vg4vQWCNg`)
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => alert(error));
    }

    const handleResult = result => {
        console.log("lat", result.result.geometry.coordinates[1]);
        console.log("lng", result.result.geometry.coordinates[0]);
        console.log(result.result.place_name);
        let mapObj = {
            mapAddress: result.result.place_name,
            latitude: result.result.geometry.coordinates[1],
            longitude: result.result.geometry.coordinates[0]
        }
        props.mapChange(mapObj);
        // props.changeFlagMap();
    }

    const handleViewportChange = (viewport) => {
        // console.log(viewport);
        setViewPort(viewport);
    }

    // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
    const handleGeocoderViewportChange = (viewport) => {
        const geocoderDefaultOverrides = { transitionDuration: 1000 }

        // console.log("after search ", viewport);
        // console.log("after search ", viewport.latitude );
        // console.log("after search ", viewport.longitude );
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
        if (navigator.geolocation) navigator.geolocation.getCurrentPosition(showPosition, showError);
        else alert("Problem in getting current location.");




        const listener = (e) => {
            if (e.key === "Escape") setSelected(null);
        }
        window.addEventListener("keydown", listener);
        return () => window.removeEventListener("keydown", listener);
    }, []);



    const arr = [[18.7358, 73.0947, 0, "address-1"], [18.74604, 73.12130751342654, 1, "address-2"]];

    const [selected, setSelected] = useState(null);



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
                    reverseGeocode={true}
                    lat={currentLocation.latitude}
                    lon={currentLocation.longitude}
                    // onResults={(results)=>console.log(results)}
                    onViewportChange={handleGeocoderViewportChange}
                    mapboxApiAccessToken='pk.eyJ1IjoidGhha2VrYXItYWJoaXNoZWsiLCJhIjoiY2s4YmN6ZzR4MDUyYzNsbnAxenlmeWpuMyJ9.H7fj6-O__SDt7Vg4vQWCNg'
                />

                <GeolocateControl
                    positionOptions={{ enableHighAccuracy: true }}
                    trackUserLocation={true}
                />
                {/* <NavigationControl  /> */}
                <button onClick={props.changeFlagMap}> Close Map</button>

                <Marker
                    latitude={currentLocation.latitude}
                    longitude={currentLocation.longitude}
                >
                    <button className="marker-btn" onClick={(e) => {
                        // console.log("hi : ");
                        e.preventDefault();
                        setSelected([currentLocation.latitude, currentLocation.longitude, 0, "current"]);
                    }}
                    >
                        <img src="/skateboard.svg" alt="skate board"></img>
                    </button>
                </Marker>
                {/* {
                    arr.map(place => {
                        return (
                            <Marker key={place[2]}
                                latitude={place[0]}
                                longitude={place[1]}
                            >
                                <button className="marker-btn" onClick={(e) => {
                                    // console.log("hi : ",view);
                                    e.preventDefault();
                                    setSelected(place);
                                }}>
                                    <img src="/skateboard.svg" alt="skate board"></img>
                                </button>
                            </Marker>
                        )
                    })
                } */}


                {
                    selected ? (
                        <Popup
                            latitude={selected[0]}
                            longitude={selected[1]}
                            onClose={() => {
                                setSelected(null);
                            }}
                        >
                            {selected[3]}
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
                                let place = [searchLocation.latitude, searchLocation.longitude, 9, "You have selected this as delivery address"];
                                setSelected(place);
                                e.preventDefault();
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

export default MapBox
