import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import Accordion from 'react-bootstrap/Accordion';
import { useEffect } from 'react';

import { parseDate } from '../../utils/utils';

import { useDispatch, useSelector } from 'react-redux';

import { getPostsById } from '../../actions/posts';

function RequestsCreatedPopup(props) {
	const { posts } = useSelector((state) => state.user);
	const Posts = useSelector((state) => posts.map(id => state.posts[id]).filter(post => post != null));

	const dispatch = useDispatch();

	useEffect(() => dispatch(getPostsById(posts)), []);

	const displayPosts = () => {
		return (
			Posts.map((req, index)=>(
				<Accordion.Item eventKey={`${index}`}  key={index}>
					<Accordion.Header>Blood Types: {req.bloodTypes.join(',')}, Donation Type: {req.donationType}, required at {req.location} by {parseDate(req.requiredBy)}</Accordion.Header>
					<Accordion.Body as={'span'}>Date Created: {parseDate(req.date)}</Accordion.Body>
					<br/>
					<Accordion.Body as={'span'}>Details: </Accordion.Body>
					<Accordion.Body as={'span'}>{req.body}</Accordion.Body>
				</Accordion.Item>
			))
		)
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
					Your Created Requests
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Accordion>
					{
						displayPosts()
					}
				</Accordion>
			</Modal.Body>
		</Modal>
	);
}

export default RequestsCreatedPopup;