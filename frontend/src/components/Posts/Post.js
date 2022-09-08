import Details from "./Details";
import DisplayMapPopup from "../Map Stuff/DisplayMapPopup";
import DisplayMapRadialRequests from "../Map Stuff/DisplayMapRadialRequests";
import {} from "react-icons/fa";
import { Button } from "react-bootstrap";

import { parseDate } from "../../utils/utils";

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { createNotification } from "../../actions/user";

const Post = ({ post, onFulfill, setModalShowProfile }) => {
	const [modalDisplayMap, setModalDisplayMap] = useState(false);
	const [notify, setNotify] = useState(false);

	const user = useSelector((state) => state.user);

	const dispatch = useDispatch();

	useEffect(() => notify && 
		dispatch(createNotification({ 
			usernames: [user.username], 
			associatedPost: post._id, 
			text: `Reminder for a donation.`, 
			givenByPoster: false, 
			timeCreated: new Date(new Date().getTime() + 3600 * 1000/2) 
		}))
		.then(() => alert('Reminder set!'))
		.then(() => setNotify(false)), [notify]);

	const notifyLater = () => {
		setNotify(true);
	}

	return (
		<div className="task" style={{borderRadius:"20px", marginTop:'20px'}}>
			<h3 style={{display: 'inline'}}> {post.bloodTypes.join(', ')} {post.donationType} required at </h3>
			{/* For making the location a clickable entity. */}
			<h3 style={{display: 'inline', cursor:'pointer', textDecoration: 'underline', color: 'red' }} onClick = {() => setModalDisplayMap(true)} > {post.location}</h3> 
			<h3 style={{display: 'inline'}}> by {parseDate(post.requiredBy)} </h3>
			<Details
				username={post.username}
				date={parseDate(post.date)}
				onFulfill={() => onFulfill(post)}
				id={post._id}
				body={post.body}
                setModalShowProfile={setModalShowProfile}
			/>
			{
				//change into a popup so that we can actually choose the time after which to be reminded
				user.username != post.username && user.userType != 'Customer_Support' &&
				<Button variant = 'success' onClick = {() => notifyLater()}>Remind me after 30 minutes</Button>
			} 
			{/* Opens popup for the map. */}
			{
				user.username != post.username ? (
					<DisplayMapPopup
						show = {modalDisplayMap}
						onHide = {() => setModalDisplayMap(false)}
						locationCoords = {post.locationCoords}
					/>
				) : (
					<DisplayMapRadialRequests
						isDonor = {false}
						post = {post}
						show = {modalDisplayMap}
						onHide = {() => setModalDisplayMap(false)}
					/>
				)
			}
		</div>
	);
};

export default Post;
