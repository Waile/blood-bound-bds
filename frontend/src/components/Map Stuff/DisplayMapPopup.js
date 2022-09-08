import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import { useDispatch, useSelector } from 'react-redux';

import { updateUser } from '../../actions/user';

function DisplayMapPopup(props) {
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [status, setStatus] = useState(false);
    const [support, setSupport] = useState(false);
    const [block, setBlock] = useState(false);
    // const options = { enableHighAccuracy: true };

    const { _id } = useSelector((state) => state.user);

    const dispatch = useDispatch();

    useEffect(() => (lat != '' && lng != '') && dispatch(updateUser(_id, { currentLocation: { type: 'Point', coordinates: [lng, lat] }, locationTime: new Date() })), [lat, lng]);

    const getLocation = () => {
        if (!navigator.geolocation) {
			setSupport(true);
            setBlock(false);
            setStatus(false);
		} else {
            navigator.geolocation.getCurrentPosition((position) => {
                setStatus(true);
                setBlock(false);
                setSupport(false);
                setLat(position.coords.latitude);
                setLng(position.coords.longitude);
            }, () => {
                setBlock(true);
                setStatus(false);
                setSupport(false);
            }); // Add options as function here for increased accuracy.
        }
    }

    const Source = [props.locationCoords?.coordinates?.[1] || 24.85095, props.locationCoords?.coordinates?.[0] || 67.04542]; //Put request coordinates from DB here.
    const Destination = [lat, lng]; //User's current location coordinates.
    const Center = [Source[0] + Destination[0] / 2, Source[1] + Destination[1] / 2]; //Centers map view between the two locations.

    return (
        <div>
            <Modal
                show = {props.show}
                onHide = {props.onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Location
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <MapContainer center={Source} zoom={19} style={{ height:"400px"}} >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={Source}></Marker>
                    </MapContainer>
                    <div style={{textAlign:'center'}}>
                        <Button variant='danger' onClick={() => getLocation()}>Allow Location To Generate Directions</Button>
                    </div>
                    {
                     status && <div style={{textAlign:'center'}}>
                            <a href={`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${Source[0]}%2C${Source[1]}%3B${Destination[0]}%2C${Destination[1]}#map=15/${Center[0]}/${Center[1]}`} style={{color:'red'}}>
                                Click here for directions!
                            </a>
                     </div>
                    }
                    {
                     support && <div style={{textAlign:'center'}}>
                            <span style={{color:'red'}}>Error: Browser does not support geolocation.</span>
                     </div>
                    }
                    {
                     block && <div style={{textAlign:'center'}}>
                            <span style={{color:'red'}}>Caution: Location access disallowed. No directions given.</span>
                     </div>
                    }
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default DisplayMapPopup;