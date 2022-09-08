import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';

import ImageContainer from '../ImageContainer';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { deleteOtherUser, searchUsers, updateOtherUser } from '../../actions/otherUsers';

import { getUsers } from '../../utils/utils';

const defaultUpdates = { id: '', isVerified: false };
const filters = { docsUpdated: true, isDeleted: false, isVerified: false, userType: { $in: ['NGO_Worker', 'MI_Worker'] } };

const needsVerification = ({ docsUpdated, isVerified, userType }) => ( docsUpdated && !isVerified && ( ['NGO_Worker', 'MI_Worker'].indexOf(userType) != -1 ) );

function VerifyNGOMIUsersPopup(props) {
    const [updates, setUpdates] = useState(defaultUpdates);
    const [deleteUser, setDeleteUser] = useState('');

    const otherUsers = useSelector((state) => state.otherUsers);
    const users = getUsers(otherUsers, needsVerification);

    const dispatch = useDispatch();

    useEffect(() => dispatch(searchUsers(filters)), []);

    useEffect(() => {
        if (updates._id != '' && updates.isVerified) {
            dispatch(updateOtherUser(updates.id, { isVerified: updates.isVerified }))
            .then(() => setUpdates(defaultUpdates));
        }
    }, [updates]);

    useEffect(() => deleteUser != '' && dispatch(deleteOtherUser(deleteUser)).then(() => setDeleteUser('')), [deleteUser]);

    const accept = (id) => {
        setUpdates({ id, isVerified: true });
    }

    const reject = (id) => {
        setDeleteUser(id);
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
                    Verify NGO/Medical Institution Worker Accounts
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Accordion>
                {
                    users.map((user, index) => (
                    <Accordion.Item eventKey={`${index}`} key={index}>
                        <Accordion.Header>Name: {user.firstName} {user.lastName} {/*ThisDateAccountCreated*/}</Accordion.Header>
                        <Accordion.Body as={'span'}>Username: {user.username} </Accordion.Body>
                        <Accordion.Body as={'span'}>User Type: {user.userType} </Accordion.Body>
                        <Accordion.Body as={'span'}>Email: {user.email || 'No email address given'} </Accordion.Body>
                        <Accordion.Body as={'span'}>Phone Number: {user.phoneNumber || 'No phone number given'} </Accordion.Body>
                        <br/>
                        <Accordion.Body as={'span'}>Verification Documents:</Accordion.Body>
                        <Accordion.Body>
                            {
                                user.verificationDocs.map((img, ind) => (
                                    <ImageContainer image={img} key={ind} />
                                ))
                            }
                        </Accordion.Body>
                        <Accordion.Body style={{paddingLeft:'572px'}}>
                            <Button variant="success" onClick={() =>accept(user._id)}>Accept</Button>
                            <Button variant="danger" onClick={() => reject(user._id)}>Reject</Button>
                        </Accordion.Body>
                    </Accordion.Item>
                    ))
                }
                </Accordion>
            </Modal.Body>
        </Modal>
    );
  }

export default VerifyNGOMIUsersPopup;