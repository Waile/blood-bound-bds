import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import DisplayMapSearch from "../Map Stuff/DisplayMapSearch";

import { useEffect, useState } from "react";

const CreateRequestPopup = (props) => {
	const [bloodTypes, setBloodTypes] = useState([]);
	const [donationType, setDonationType] = useState("");
	const [location, setLocation] = useState("");
	const [latitude, setLatitude] = useState('');
	const [longitude, setLongitude] = useState(''); //
	const [body, setBody] = useState("");
	const [date, setDate] = useState({ day: '', month: '', year: '', hour: '', min: '' });
	const [ampm, setAmpm] = useState('');
	const [requiredBy, setRequiredBy] = useState(new Date(0));

	const bloodTypesArr = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
	const dateFields = ['day', 'month', 'year', 'hour', 'min'];

	const cleanUp = () => {
		setBloodTypes([]);
		setDonationType("");
		setLocation("");
		setDate({ day: '', month: '', year: '', hour: '', min: '' });
		setRequiredBy(new Date(0));
		setBody("");
		setLatitude('');
		setLongitude('');
	}

	useEffect(() => !props.show && cleanUp(), [props.show]);

	useEffect(() => { //must be used because the update to requiredBy is async, so we submit once it is done
		let isComponentMounted = true;
		if (isComponentMounted) {
			if (+requiredBy > +(new Date(0)) ) { //if it is not in the default state
				props.onSubmit({
					bloodTypes,
					donationType,
					location,
					requiredBy,
					body,
					locationCoords: { type: 'Point', coordinates: [longitude, latitude] },
				});
				props.onHide();
			}
		}
		return () => {
			isComponentMounted = false;
		}
	}, [requiredBy])

	const onSubmit = (e) => {
		e.preventDefault();
		if (!latitude || !longitude) {
			alert('Please select the location on the map as well.');
			return;
		}
		if (bloodTypes.length == 0) {
			alert("Please add blood type(s).");
			return;
		}
		if (donationType == "Please select donation type") {
			alert("Please add donation type.");
			return;
		}
		if (!location) {
			alert("Please add location.");
			return;
		}
		if (ampm == "Please select AM/PM") {
			alert("Please select AM/PM");
			return;
		}
		if (!body) {
			alert("Please add message.");
			return;
		}
		if (!validateDate()) {
			alert("Please enter a correct date.");
			return;
		}
	};

	const padTime = (val) => {
		console.log(val, 'padding')
		if (val.length == 1) {
			return '0' + val;
		}
		return val;
	}

	const validateDate = () => {
		const { day, month, year, hour, min } = date;

		try {
			let hour_new = String(Number(hour) % 12);

			if (Number(hour) > 12 || Number(hour) < 1) {
				return false;
			}
			if (ampm == 'PM') {
				hour_new = String(Number(hour_new) + 12)
			}
      
			const stringified = [year, month, day].map((thing) => padTime(thing)).join('-') + 'T' + [hour_new, min].map(thing => padTime(thing)).join(':');
			console.log(stringified)
			const parsed = Date.parse(stringified);
			if (isNaN(parsed)) {
				return false;
			}
			const parsedDate = new Date(parsed);

			if ( +parsedDate - (+(new Date())) <= 0 ) { //this is lower than the current time value
				return false;
			}
			setRequiredBy(parsedDate);
			return true;
		} catch (error) {
			console.log(error)
			return false;
		}
	}

	const onCheckboxCheck = (e) => {
		const index = bloodTypes.indexOf(e.target.id);
		if (index !== -1) {
			bloodTypes.splice(index, 1);
			setBloodTypes([...bloodTypes]);
		} else {
			bloodTypes.push(e.target.id);
			setBloodTypes([...bloodTypes]);
		}
	}

	const updateDate = (e) => {
		date[e.target.placeholder] = e.target.value;
		setDate({ ...date });
	}

	const setLat = (lat) => {
        setLatitude(lat);
    }

	const setLon = (lon) => {
        setLongitude(lon);
    }

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
					Create New Request
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={onSubmit}>
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
						<label>Donation Type</label>
						<Form.Select onChange={(e) => setDonationType(e.target.value)} >
							<option>Please select donation type</option>
							<option value="Blood">Blood</option>
							<option value="Plasma">Plasma</option>
						</Form.Select>
					</div>
					<div className="form-control">
						<label>Location (to be displayed on the request)</label>
						<input
							type="text"
							placeholder="Enter location"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
						/>
						<DisplayMapSearch
							setLat={(lat) => setLat(lat)}
							setLon={(lon) => setLon(lon)}
						/>
					</div>
					<div className="form-control">
						<label>Required by (Date and Time)</label>
						<div>
							{
								dateFields.map(field => (
									<input
										key={`${field}`}
										type="text"
										placeholder={`${field}`}
										value={date[field]}
										onChange = {(e) => updateDate(e)}
									/>
								))
							}
						</div>
						<Form.Select onChange={(e) => setAmpm(e.target.value)} >
							<option>Please select AM/PM</option>
							<option value="AM">AM</option>
							<option value="PM">PM</option>
						</Form.Select>
					</div>
					<div className="form-control">
						<label>Message</label>
						<input
							type="text"
							placeholder="Enter text here"
							value={body}
							onChange={(e) => setBody(e.target.value)}
						/>
					</div>
					<Button variant="dark" style={{marginLeft:'90%'}} onClick={(e) => onSubmit(e)}>Create</Button>
					<br/>
				</Form>
			</Modal.Body>
		</Modal>
	);
};


export default CreateRequestPopup;