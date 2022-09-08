import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';

import OtherProfilePopup from '../Profile/OtherProfilePopup';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getReports, updateReport } from '../../actions/reports';

function ManageReportedUsersPopup(props) {
	const [modalProfileSnitch, setModalProfileSnitch] = useState(false);
	const [modalProfileCulprit, setModalProfileCulprit] = useState(false);
	
	const reports = useSelector((state) => state.reports);

	const { username, reportsFiled } = useSelector((state) => state.user);

	const dispatch = useDispatch();

	useEffect(() => dispatch(getReports()), [reportsFiled]);

	const rescindReport = (index) => dispatch(updateReport(reports[index]._id, { isActive: false }));

	const deleteReport = (index) => dispatch(updateReport(reports[index]._id, { show: false }));

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
						Reported Users
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Accordion>
						{
							reports.map((report, index) => (
								<Accordion.Item eventKey={`${index}`} key={index}>

									<Accordion.Header>{`${report.snitch} reporting ${report.culprit}`}</Accordion.Header>

									{ 
										username != report.snitch 
										? (<Accordion.Body as={'span'} onClick={() => setModalProfileSnitch(true)} style={{ cursor:'pointer', textDecoration: 'underline', color: 'blue' }} >{`Accuser: ${report.snitch}`}</Accordion.Body>)
										: (<Accordion.Body as={'span'} onClick={() => props.setModalShowProfile(true)} style={{ cursor:'pointer', textDecoration: 'underline', color: 'blue' }} >{`Accuser: ${report.snitch}`}</Accordion.Body>)
									}
									{ username != report.snitch && <OtherProfilePopup username={report.snitch} show = {modalProfileSnitch} onHide = {() => setModalProfileSnitch(false)}/> }

									<Accordion.Body as={'span'} style={{ cursor:'pointer', textDecoration: 'underline', color: 'blue' }} onClick={() => setModalProfileCulprit(true)}>{`Accused: ${report.culprit}`}</Accordion.Body>
									<OtherProfilePopup username={report.culprit} show = {modalProfileCulprit} onHide = {() => setModalProfileCulprit(false)}/>

									<Accordion.Body as={'span'}>{`Reason: ${report.reason}`}</Accordion.Body>
									<Accordion.Body as={'span'}>{`Explanation: ${report.body}`}</Accordion.Body>

									<Accordion.Body style={{paddingLeft:'572px'}}>
										<Button variant="success" id={`${index}`} onClick={() => rescindReport(index)}>Rescind</Button>
										<Button variant="danger" id={`${index}`} onClick={() => deleteReport(index)}>Delete</Button>
									</Accordion.Body>

								</Accordion.Item>
							))
						}
					</Accordion>
				</Modal.Body>
			</Modal>
		</div>
	);
}

export default ManageReportedUsersPopup;