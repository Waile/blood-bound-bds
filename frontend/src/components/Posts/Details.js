import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button"; 
import Col from "react-bootstrap/Col";

import ReportPopup from "../ReportPopup";
import OtherProfilePopup from "../Profile/OtherProfilePopup";
import ChatScreenPopup from "../Chat/ChatScreenPopup";

import { useState } from "react";
import { useSelector } from "react-redux";

const Details = ({ username, date, onFulfill, id, body, setModalShowProfile }) => {
	const [modalReport, setModalReport] = useState(false);
	const [modalProfile, setModalProfile] = useState(false);
	const [modalChat, setModalChat] = useState(false);

	const user = useSelector((state) => state.user);

	return (
		<div className="container3">
				<span>Posted by: </span>
				{ 
					user.username != username 
					? (<span onClick={() => setModalProfile(true)} style={{ cursor:'pointer', textDecoration: 'underline', color: 'red' }} >{username}</span>)
					: (<span onClick={() => setModalShowProfile(true)} style={{ cursor:'pointer', textDecoration: 'underline', color: 'red' }} >{username}</span>)
				}
				<br/>
				<span>Date Created: {date}</span>
				<br/>
				<br/>
				<span>Details:</span>
				<br/>
				<span>{body}</span>
				<br/>
				<br/>
				<Row className="mx-0">
					{ ((user.userType !== "Admin") && (user.userType !== "Customer_Support")) && <Button as={Col} variant="dark" onClick={() => onFulfill()}>Fulfill</Button> }
					{ ((user.userType == "Admin") && (user.username == username)) && <Button as={Col} variant="dark" onClick={() => onFulfill()}>Fulfill</Button> }
					{ ((user.userType != "Admin") && (user.userType != "Customer_Support") && (user.username != username)) && <Button as={Col} variant="dark" onClick={() => setModalChat(true)}>Contact</Button> }
					{ user.username != username && <Button as={Col} variant="danger" onClick={() => setModalReport(true)}>Report</Button> }
				</Row>
				{ user.username != username && <ReportPopup show={modalReport} username={username} onHide={() => setModalReport(false)} /> }
				{ user.username != username && <OtherProfilePopup show={modalProfile} username={username} onHide={() => setModalProfile(false)} /> }
				{ user.username != username && <ChatScreenPopup show={modalChat} onHide={() => setModalChat(false)} username={username} id={id} /> }
		</div>
	);
};

export default Details;