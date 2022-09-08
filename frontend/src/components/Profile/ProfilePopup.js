import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Figure from 'react-bootstrap/Figure';
// import ProfileImage from '../images/profileicon.svg';
import EditAccountPopup from './EditAccountPopup';
import ChangePasswordPopup from '../Profile/ChangePasswordPopup';
import ImageContainer from '../ImageContainer';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setForDelete } from '../../actions/user';

function ProfilePopup(props) {
    const [modalEditAccount, setModalEditAccount] = useState(false);
    const [modalChangePassword, setModalChangePassword] = useState(false);

    const user = useSelector((state) => state.user);

    const dispatch = useDispatch();

    const deleteAccount = () => dispatch(setForDelete(user._id)).then(() => props.nullifyToken());

    return (
    <div>
        <Modal
            show = {props.show}
            onHide = {props.onHide}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Profile
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <Figure style = { { display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '50%'} }>
                        <ImageContainer
                            image={user.livePhoto} 
                        />
                    </Figure>
                    <Form.Label>Username: {user.username}</Form.Label>
                    <br/>
                    <Form.Label>Full Name: {user.firstName} {user.middleName || ''} {user.lastName}</Form.Label>
                    <br/>
                    <Form.Label>Email: {user.email || 'None'}</Form.Label>
                    <br/>
                    <Form.Label>Phone Number: {user.phoneNumber || 'None'}</Form.Label>
                    <br/>
                    <Form.Label>Blood Type: {user.bloodType}</Form.Label>
                    <Button variant="dark" onClick = {() => setModalEditAccount(true)} style = { { display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '100%' } }>Edit Account Details</Button>
                    <Button variant="dark" onClick = {() => setModalChangePassword(true)} style = { { display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '100%' } }>Change Password</Button>
                    <Button variant="danger" style = { { display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '100%' } } onClick = {() => deleteAccount()}>Delete Account</Button>
                </Form.Group>
            </Modal.Body>
        </Modal>
        <EditAccountPopup
            show = {modalEditAccount}
            onHide = {() => setModalEditAccount(false)} 
        />
        <ChangePasswordPopup 
            show = {modalChangePassword}
            onHide = {() => setModalChangePassword(false)}
        />
    </div>
    );
  }

export default ProfilePopup;