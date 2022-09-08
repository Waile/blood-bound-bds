import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createReport } from '../actions/user';

function ReportPopup(props) {
	const [reason, setReason] = useState('');
	const [body, setBody] = useState('');

	const { username } = useSelector((state) => state.user);

	const dispatch = useDispatch();

	const reportPost = (report) => {
        console.log(report);
		dispatch(createReport(report));
    }

	const onSubmit = () => {
		console.log(reason)
		if (!reason || reason == 'Please select a reason') {
			alert('Please select a reason');
			return;
		}
		if (!body) {
			alert('Please add an explanation');
			return;
		}
		reportPost({ reason, body, culprit: props.username, snitch: username });
		props.onHide();
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
				<Modal.Title id="contained-modal-title-vcenter">Report User</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<label>Reason</label>
				<br/><br/>
				<Form.Select onChange={(e) => setReason(e.target.value)}>
					<option>Please select a reason</option>
					<option value="Abuse">Abuse</option>
					<option value="Harrassment">Harrassment</option>
					<option value="Suspicious Activity">Suspicious Activity</option>
					<option value="Spam">Spam</option>
				</Form.Select>
				<br/>
				<label>Body</label>
				<Form.Control onChange={(e) => setBody(e.target.value)}
					as="textarea"
					placeholder="Please enter details here"
					style={{ height: '200px' }}
				/>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="dark" onClick={onSubmit}>Submit</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default ReportPopup;