import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import DisplayMapSearch from "../Map Stuff/DisplayMapSearch";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createEmergencyPost } from '../../actions/emergencyPosts';

function EmergencyHighlightPopup(props) {
	const [latitude, setLatitude] = useState('');   //Haven't made form fields for these two since I assume you need to make backend changes first.
	const [longitude, setLongitude] = useState(''); //
	const [bloodTypes, setBloodTypes] = useState([]);
	const [locations, setLocations] = useState('');
	const [body, setBody] = useState('');
	const [submitted, setSubmitted] = useState(false);
	const bloodTypesArr = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

	const user = useSelector((state) => state.user);

	const dispatch = useDispatch();

	const onSubmit = () => {
		if (bloodTypes.length == 0) {
			alert("Please add blood type(s).");
			return;
		}
		if (!locations) {
			alert("Please add location(s).");
			return;
		}
		if (!body) {
			alert("Please add a message.");
			return;
		}
		setSubmitted(true);
	}

	const cleanUp = () => {
		setSubmitted(false);
		setBloodTypes([]);
		setLocations('');
		setBody('');
		setLatitude('');
		setLongitude('');
		props.onHide();
	}

	const onCheckboxCheck = (e) => {
		const index = bloodTypes.indexOf(e.target.id);
		if(index !== -1) {
			bloodTypes.splice(index, 1);
			setBloodTypes(bloodTypes);
		} else {
			bloodTypes.push(e.target.id);
			setBloodTypes(bloodTypes);
		}
	}

	const setLat = (lat) => {
        setLatitude(lat);
    }

	const setLon = (lon) => {
        setLongitude(lon);
    }

	useEffect(() => submitted && dispatch(createEmergencyPost({
		username: user.username,
		created: new Date(),
		bloodTypes,
		locations,
		body,
		locationCoords: { type: 'Point', coordinates: [longitude, latitude] },
	}, user)).then(() => cleanUp()), [submitted]);

	return (
		<Modal
			show = {props.show}
			onHide = {props.onHide}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Create Emergency Highlight
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div key={`inline-${'checkbox'}`} className="mb-3">
					<label>Blood Types:</label>
					<br/>
					{
						bloodTypesArr.map((bType, index) => (
							<Form.Check onChange = {(e) => onCheckboxCheck(e) }
								inline
								label={` ${bType}`}
								type='checkbox'
								id={`${bType}`}
								key={index}
							/>
						))
					}
				</div>
				<div className="form-control">
					<label>Location (to be displayed on the banner):</label>
					<input
						type="text"
						placeholder="Enter location"
						value={locations}
						onChange={(e) => setLocations(e.target.value)}
					/>
					<DisplayMapSearch
						setLat={(lat) => setLat(lat)}
						setLon={(lon) => setLon(lon)}
					/>
				</div>
				<div className="form-control">
					<label>Body:</label>
					<Form.Control onChange={(e) => setBody(e.target.value)}
						as="textarea"
						placeholder="Please enter details here"
						style={{ height: '200px' }}
					/>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="dark" onClick={onSubmit}>Submit</Button>
			</Modal.Footer>
		</Modal>
	);
}

  export default EmergencyHighlightPopup;