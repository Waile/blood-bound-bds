import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';

import ImageContainer from '../ImageContainer';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getUsersById, updateOtherUser } from '../../actions/otherUsers';

const defaultUpdates = { _id: '', isVerified: false, setIneligibleBy: null };

function ManageBloodDonorsPopup(props) {
    const [updates, setUpdates] = useState(defaultUpdates);

    const { accountsCreated } = useSelector((state) => state.user);

    const users = useSelector((state) => accountsCreated.map(id => state.otherUsers[id]).filter(user => user != null));

    const requiredIDs = useSelector((state) => accountsCreated.filter(id => state.otherUsers[id] == null));

    const { username } = useSelector((state) => state.user);

    const dispatch = useDispatch();

    useEffect(() => dispatch(getUsersById(requiredIDs)), [accountsCreated]);

    useEffect(() => {
        if (updates._id != '' && updates.isVerified) {
            dispatch(updateOtherUser(updates._id, { isVerified: updates.isVerified, setIneligibleBy: updates.setIneligibleBy }))
            .then(() => setUpdates(defaultUpdates));
        }
    }, [updates]);

    const accept = (_id) => {
        setUpdates({ _id, isVerified: true, setIneligibleBy: null });
    }

    const reject = (_id) => {
        setUpdates({ _id, isVerified: true, setIneligibleBy: username });
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
                    Manage Blood Donors
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Accordion>
                    {
                        users.length > 0 ? users.map((user, index) => (
                            <Accordion.Item eventKey={`${index}`} key={index}>
                                <Accordion.Header>{`Name: ${user.firstName} ${user.middleName || ""} ${user.lastName}`}</Accordion.Header>
                                <Accordion.Body as={'span'}>{`Username: ${user.username}`}</Accordion.Body>
                                <Accordion.Body as={'span'}>{`Verified (yes/no): ${user.isVerified ? 'yes': 'no'}`}</Accordion.Body>
                                <Accordion.Body as={'span'}>{`Eligible (yes/no): ${user.setIneligibleBy == null ? 'yes': 'no'}`}</Accordion.Body>
                                <Accordion.Body as={'span'}>{`User Type: ${user.userType}`}</Accordion.Body>
                                <Accordion.Body as={'span'}>{`Email: ${user.email || "No email provided"}`}</Accordion.Body>
                                <Accordion.Body as={'span'}>{`Phone Number: ${user.phoneNumber || "No phone number provided"}`}</Accordion.Body>
                                <br/>
                                <Accordion.Body as={'span'}>Verification Documents:</Accordion.Body>
                                <Accordion.Body>
                                    {
                                        user.verificationDocs.map((img, ind) => (
                                            <ImageContainer image={img} key={ind}/>
                                        ))
                                    }
                                </Accordion.Body>
                                <Accordion.Body style={{paddingLeft:'572px'}}>
                                    <Button variant="success" onClick={() =>accept(user._id)}>Set Eligible</Button>
                                    <Button variant="danger" onClick={() => reject(user._id)}>Set Ineligible</Button>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))
                        : []
                    }
                </Accordion>
            </Modal.Body>
        </Modal>
    );
  }

export default ManageBloodDonorsPopup;