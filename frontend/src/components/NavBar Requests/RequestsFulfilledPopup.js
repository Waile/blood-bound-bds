import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';

import ReportPopup from '../ReportPopup';
import OtherProfilePopup from '../Profile/OtherProfilePopup';

import { parseDate } from '../../utils/utils';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getPostsById } from '../../actions/posts';

function RequestsFulfilledPopup(props) {
    const [reportShow, setReportShow] = useState(false);
	const [modalProfile, setModalProfile] = useState(false);

	const { donationsCompleted } = useSelector((state) => state.user);
	const requests = useSelector((state) => donationsCompleted.map(id => state.posts[id]).filter(post => post != null));

	const dispatch = useDispatch();

	useEffect(() => dispatch(getPostsById(donationsCompleted)), []);

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
				<Modal.Title id="contained-modal-title-vcenter">
					Requests You Have Fulfilled
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Accordion>
					{
						requests.map((req, index) => (
							<Accordion.Item eventKey={`${index}`}  key={index}>

								<Accordion.Header>Blood Types: {req.bloodTypes.join(',')}, Donation Type: {req.donationType}, required at {req.location} by {parseDate(req.requiredBy)}</Accordion.Header>

								<Accordion.Body as={'span'}>Date Created: {parseDate(req.date)}</Accordion.Body>

								<Accordion.Body as={'span'} onClick={() => setModalProfile(true)} style={{ cursor:'pointer', textDecoration: 'underline', color: 'blue' }} >Posted By: {req.username}</Accordion.Body>
								<OtherProfilePopup username={req.username} show = {modalProfile} onHide = {() => setModalProfile(false)}/>
								<br/>

								<Accordion.Body as={'span'}>Details: </Accordion.Body>
								<Accordion.Body as={'span'}>{req.body}</Accordion.Body>

								<Accordion.Body style={{marginLeft:'84%'}}>
									<Button variant="dark" onClick={() => setReportShow(true)}>Report!</Button> {/*connecting report button left to rehan*/}
								</Accordion.Body>

								<ReportPopup show={reportShow} username={req.username} onHide={() => setReportShow(false)}/>

							</Accordion.Item>
						))
					}
				</Accordion>
			</Modal.Body>
		</Modal>
	</div>
	);
  }

export default RequestsFulfilledPopup;