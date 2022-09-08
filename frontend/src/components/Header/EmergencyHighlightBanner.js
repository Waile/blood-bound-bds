import Carousel from 'react-bootstrap/Carousel';
import "bootstrap/dist/css/bootstrap.min.css";

import { parseDate } from '../../utils/utils';

import DisplayMapPopup from "../Map Stuff/DisplayMapPopup";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getEmergencyPosts } from '../../actions/emergencyPosts';

function EmergencyHighlightBanner(props) {
	const [modalDisplayMap, setModalDisplayMap] = useState(false);

    const ePosts = useSelector((state) => state.emergencyPosts);

    const dispatch = useDispatch();

    useEffect(() => dispatch(getEmergencyPosts()), []);

    return ePosts.length > 0 ? (
        <Carousel variant='dark' style={{ paddingLeft: '300px', paddingRight: '300px', paddingTop:'110px', backgroundColor:'#F7E981' }}>
            {
                ePosts.map((res, index) => (
                    <Carousel.Item interval={3000} key={index}>
                        <h3>Emergency!</h3>

                        <span>Copious amounts of blood is required at these specified locations:&nbsp;</span>
                        <span style={{display: 'inline', cursor:'pointer', textDecoration: 'underline', color: 'red' }} onClick = {() => setModalDisplayMap(true)}>{`${res.locations}`}</span>
                        
                        <span style={{display:'block'}}>The required blood types are: {`\n${res.bloodTypes.join(',')}`}</span>

                        <p>{`\n${res.body}`}</p>

                        <hr />
                        <p className="mb-0">This message is generated at this time: { parseDate(res.created) }</p>
                        <br/>
                        <DisplayMapPopup
                            show = {modalDisplayMap}
                            onHide = {() => setModalDisplayMap(false)}
                            locationCoords={res.locationCoords}
                        />
                    </Carousel.Item>
                ))
            }
        </Carousel>
    ) : (<h2></h2>);
}

export default EmergencyHighlightBanner;