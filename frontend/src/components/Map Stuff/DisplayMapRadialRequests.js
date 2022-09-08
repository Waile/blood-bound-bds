import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import "bootstrap/dist/css/bootstrap.min.css";
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';

import OtherProfilePopup from '../Profile/OtherProfilePopup';
import Post from '../Posts/Post';

import * as api from '../../api';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createNotification, updateUser } from '../../actions/user';

function DisplayMapPopup(props) {
    const [lat, setLat] = useState(!props.isDonor ? props.post?.locationCoords?.coordinates?.[1] : '');
    const [lng, setLng] = useState(!props.isDonor ? props.post?.locationCoords?.coordinates?.[0] : '');
    const Source = [lat, lng];
    const [support, setSupport] = useState(false);
    const [block, setBlock] = useState(false);
    // const options = { enableHighAccuracy: true };

    //For the circle surrounding the user's current location.
    const redOptions = { color: 'red' };
    const radiiList = [2500, 3750, 5000, 6250]; //In meters.
    const [radiiOption, setRadiiOption] = useState(radiiList[0]);
    const [Points, setPoints] = useState([]);

    const [modals, setModals] = useState([]);
    const [notify, setNotify] = useState(false);

    const user = useSelector((state) => state.user);

    const dispatch = useDispatch();

    const updateModalArray = (index, val) => {
        setModals(Points.map((Point, ind) => ind != index ? false : val));
    }

    useEffect(async () => {
        if (lat != '' && lng != '' && props.isDonor) { //giving this donor's current location
            dispatch(updateUser(user._id, { currentLocation: { type: 'Point', coordinates: [lng, lat] }, locationTime: new Date() }));
        }
    }, [lat, lng])

    const getLocation = () => {
        if (!navigator.geolocation) {
			setSupport(true);
            setBlock(false);
		} else {
            navigator.geolocation.getCurrentPosition((position) => {
                setBlock(false);
                setSupport(false);
                setLat(position.coords.latitude);
                setLng(position.coords.longitude);
                console.log(position.coords.latitude, position.coords.longitude)
            }, () => {
                setBlock(true);
                setSupport(false);
            }); // Add options as function here for increased accuracy.
        }
    }

    const getNearbyPoints = () => {
        if (!props.isDonor) { //a poster is looking for nearby donors
            return api.getNearbyDonors({ locationCoords: props.post.locationCoords.coordinates, bloodTypes: props.post.bloodTypes, distance: radiiOption })
        } else { //a donor is looking for nearby requests
            return api.getNearbyRequests({ locationCoords: [lng, lat], bloodType: user.bloodType, distance: radiiOption });
        }
    }

    useEffect(() => {
        let isComponentMounted = true;
        if (lat != '' && lng != '') {
            getNearbyPoints()
            .then(res => {
                if (isComponentMounted) {
                    const points = res.data.filter((elem) => elem.username != user.username); //don't show your own posts/location.
                    setPoints(points);
                }
            })
            .catch(error => console.log(error));
        }

        return () => {
            isComponentMounted = false;
        }
    }, [lat, lng, radiiOption])

    const otherMarkers = () => {
        if (!props.isDonor) {
            return (
                Points.map((user, index) => (
                    <Marker position={[...user.currentLocation.coordinates].reverse()} key={index}>
                        <Popup>
                            <Button onClick={() => updateModalArray(index, true)}>
                                {user.username}
                            </Button>
                        </Popup>
                        <OtherProfilePopup username={user.username} show={modals?.[index]} onHide={() => updateModalArray(index, false)}/>
                    </Marker>
                ))
            )
        } else {
            return (
                Points.map((post, index) => (
                    <Marker position={[...post.locationCoords.coordinates].reverse()} key={index}>
                        <Popup>
                            <Button onClick={() => updateModalArray(index, true)}>
                                {`${post.username} ${post.bloodTypes.join(',' )}`}
                            </Button>
                        </Popup>
                        <Modal show={modals?.[index]} onHide={() => updateModalArray(index, false)}>
                            <Post post= {post} {...props}/>
                        </Modal>
                    </Marker>
                ))
            )
        }
    }

    const notifyDonors = () => {
        setNotify(true);
    }

    useEffect(() => notify && 
        dispatch(createNotification({
            usernames: Points.map(otherUser => otherUser.username), 
            associatedPost: props.post._id, 
            text: `A donation is required near you.`, 
            givenByPoster: true, 
            timeCreated: new Date()
        }))
        .then(() => alert('Notified!'))
        .then(() => setNotify(false)), [notify]);

    return (
        
        <div>
            <Modal key = {Points.length}
                show = {props.show}
                onHide = {props.onHide}
                fullscreen = {true}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Location
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <MapContainer center={Source} zoom={14} style={{ height:"89%"}} >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Circle center={Source} pathOptions={redOptions} radius={radiiOption} />
                        {/* For user's current location. */}
                        <Marker position={Source}>
                            <Popup>
                                You are here.
                            </Popup>
                        </Marker>
                        {/* For other locations. */}
                        {
                            otherMarkers()
                        }
                    </MapContainer>
                    <div style={{textAlign:'center'}}>
                        {/* Sets the circle's radius. */}
                        <form>
                            <label style={{marginLeft:'8px'}}>Circle Radius: &nbsp;
                                <select value={radiiOption} onChange={(e) => setRadiiOption(e.target.value)}>
                                    <option value={radiiList[0]}>2.50km</option>
                                    <option value={radiiList[1]}>3.75km</option>
                                    <option value={radiiList[2]}>5.00km</option>
                                    <option value={radiiList[3]}>6.25km</option>
                                </select>
                            </label>
                        </form>
                        {
                            props.isDonor &&
                            (<Button variant='danger' onClick={() => getLocation()}>Allow Location To Display Requests Near You</Button>)
                        }
                        {
                            !props.isDonor && Points.length > 0 && 
                            (<Button variant='danger' onClick={() => notifyDonors()}>Notify Nearby Donors</Button>)
                            //choosing to notify nearby donors if we are viewing the map near a created post
                        }
                        <br/>
                        {
                            Points.length == 0 && `No nearby ${props.isDonor ? 'requests' : 'donors'}`
                        }
                    </div>
                    {
                     support && <div style={{textAlign:'center'}}>
                            <span style={{color:'red'}}>Error: Browser does not support geolocation.</span>
                     </div>
                    }
                    {
                     block && <div style={{textAlign:'center'}}>
                            <span style={{color:'red'}}>Caution: Location access disallowed. No Donors will be shown.</span>
                     </div>
                    }
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default DisplayMapPopup;