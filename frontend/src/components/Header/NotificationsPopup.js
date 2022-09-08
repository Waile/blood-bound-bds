import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup'
import "bootstrap/dist/css/bootstrap.min.css";

import Post from '../Posts/Post';

import { parseDate } from '../../utils/utils';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getPostsById } from '../../actions/posts';
import { getNotificationsById, markAsRead } from '../../actions/notifs';

function NotificationsPopup(props) {
    const [modalArray, setModalArray] = useState([]);

    const { notifications } = useSelector((state) => state.user);
    const notifs = useSelector((state) => state.notifs);

    const postIDs = notifs.map(notif => notif.associatedPost);
    const posts = useSelector((state) => postIDs.map(id => state.posts[id]).filter(post => post != null));

    const dispatch = useDispatch();

    useEffect(() => notifications && dispatch(getNotificationsById(notifications)), []);

    useEffect(() => (notifs.length > 0) && props.setNewNotifications(notifs.filter(notif => !notif.read).length > 0), [notifs]);
    
    useEffect(() => (notifs.length > 0) && dispatch(getPostsById(postIDs)), [notifs]);

    const updateModalArray = (index, val) => {
        setModalArray(notifs.map((notif, ind) => ind != index ? false : val));
    }

    useEffect(() => {
        if (props.show) {
            const unread = notifs.filter(notif => !notif.read).map(notif => notif._id);
            if (unread.length > 0) {
                dispatch(markAsRead(unread)).then(() => props.setNewNotifications(false))
            }
        }
    }, [notifs, props.show])

    return (
        <div>
            <Modal
                show = {props.show}
                onHide = {props.onHide}
                size = "lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Notifications
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        {
                            notifs.map((notification, index) => (
                                <ListGroup.Item key={index}>
                                    <div style={{cursor:'pointer'}} onClick={() => updateModalArray(index, true)}>
                                        <span>{`${notification.text} (${parseDate(notification.timeCreated)})`}</span>
                                    </div>
                                    <Modal show={modalArray?.[index]} onHide={() => updateModalArray(index, false)}>
                                        <Post post = {posts[index]} {...props}/>
                                    </Modal>
                                </ListGroup.Item>
                            ))
                        }
                    </ListGroup>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default NotificationsPopup;