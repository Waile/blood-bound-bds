import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';

import ImageContainer from '../ImageContainer';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { searchUsers, updateOtherUser } from '../../actions/otherUsers';

import { getUsers } from '../../utils/utils';

const defaultUpdates = { _id: '', isVerified: false, setIneligibleBy: null };
const filters = { docsUpdated: true, isVerified: false, userType: { $in: ['Blood_Donor', 'Blood_Requester'] } };

const needsOnboarding = ({ docsUpdated, isVerified, userType }) => ( docsUpdated && !isVerified && ( ['Blood_Donor', 'Blood_Requester'].indexOf(userType) != -1 ) );

function OnboardingPopup(props) {
    const [updates, setUpdates] = useState(defaultUpdates);

    const { username } = useSelector((state) => state.user);

    const otherUsers = useSelector((state) => state.otherUsers);
    const users = getUsers(otherUsers, needsOnboarding);

    const dispatch = useDispatch();

    useEffect(() => dispatch(searchUsers(filters)), []);

    useEffect(() => {
        if (updates._id != '' && updates.isVerified) {
            dispatch(updateOtherUser(updates.id, { isVerified: updates.isVerified, setIneligibleBy: updates.setIneligibleBy }))
            .then(() => setUpdates(defaultUpdates));
        }
    }, [updates]);

    const accept = (id) => {
        setUpdates({ id, isVerified: true });
    }

    const reject = (id) => {
        setUpdates({ id, isVerified: true, setIneligibleBy: username })
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
                Onboard Blood Donors
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
                        <Accordion.Body>
                            {
                                user.verificationDocs.map((img, ind) => (
                                    <ImageContainer image={img} key={ind}/>
                                ))
                            }
                        </Accordion.Body>
                        <Accordion.Body style={{paddingLeft:'572px'}}>
                            <Button variant="success" onClick ={() => accept(user._id)}>Accept</Button>
                            <Button variant="danger" onClick = {() => reject(user._id)}>Reject</Button>
                        </Accordion.Body>
                    </Accordion.Item>
                    ))
                }
                </Accordion>
            </Modal.Body>
        </Modal>
    );
  }

export default OnboardingPopup;