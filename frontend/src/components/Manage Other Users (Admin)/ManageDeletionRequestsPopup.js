import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getUsers } from '../../utils/utils';
import { deleteOtherUser, searchUsers, updateOtherUser } from '../../actions/otherUsers';

const defaultUpdates = { _id: '', decision: '' };
const filters = { isDeleted: true };

const needsDeletion = ({ isDeleted }) => isDeleted;

function ManageDeletionRequestsPopup(props) {
    const [updates, setUpdates] = useState(defaultUpdates);

    const otherUsers = useSelector((state) => state.otherUsers);
    const users = getUsers(otherUsers, needsDeletion);

    const dispatch = useDispatch();

    useEffect(() => dispatch(searchUsers(filters)), []);

    const contactApi = () => {
        if (updates.decision == 'accept') {
            return dispatch(deleteOtherUser(updates._id));
        } else {
            return dispatch(updateOtherUser(updates._id, { isDeleted: false }));
        }
    }
    
    useEffect(() => {
        if (updates._id != '' && updates.decision != '') {
            contactApi().then(() => setUpdates(defaultUpdates));
        }
    }, [updates])

    const accept = (index) => {
        const _id = users[index]._id;
        setUpdates({ _id, decision: 'accept' });
    }

    const reject = (index) => {
        const _id = users[index]._id;
        setUpdates({ _id, decision: 'reject' });
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
                    Manage Deletion Requests
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Accordion>
                    {
                        users.map((user, index) => (
                            <Accordion.Item key={index}>
                                <Accordion.Header>Name: {`${user.firstName} ${user.middleName || ''} ${user.lastName}`}</Accordion.Header>
                                <Accordion.Body as={'span'}>Username: {user.username}</Accordion.Body>
                                <Accordion.Body as={'span'}>User Type: {user.userType}</Accordion.Body>
                                <Accordion.Body as={'span'}>Email: {user.email}</Accordion.Body>
                                <Accordion.Body as={'span'}>Phone Number {user.phoneNumber}:</Accordion.Body>
                                <Accordion.Body style={{paddingLeft:'572px'}}>
                                    <Button variant="danger" onClick={() =>accept(index)}>Delete</Button>
                                    <Button variant="success" onClick={() => reject(index)}>Restore</Button>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))
                    }
                </Accordion>
            </Modal.Body>
        </Modal>
    );
  }

export default ManageDeletionRequestsPopup;