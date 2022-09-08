import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { updateUser } from '../../actions/user';


function EditAccountPopup(props) {
    const [email, setEmail] = useState('');
    const [phoneNumber, setphoneNumber] = useState('');
    const [emailerror, setEmailerror] = useState('');

    const user = useSelector((state) => state.user);

    const dispatch = useDispatch();

    const onSubmit = () => {
        console.log('Submitted');
        const updates = {}
        if (email != '' && email != user.email) {
            updates.email = email
        }
        if (phoneNumber != '' && phoneNumber != user.phoneNumber) {
            updates.phoneNumber = phoneNumber
        }
        if (!updates.email && !updates.phoneNumber) {
            return;
        }
        dispatch(updateUser(user._id, updates));
        setEmail('');
        setphoneNumber('');
        props.onHide();
    }

    return (
    <Modal
        show = {props.show}
        onHide = {props.onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        dialogClassName="modal-50w"
        centered
        style = {{backgroundColor: '#C0C0C0A6'}}
    >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
            <Form.Group className="mb-3">
                <Form.Control type="email" placeholder="New Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <Form.Label style = { { display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '50%', color: 'tomato' } }>{emailerror}</Form.Label>
                <Form.Control type="phoneNumber" placeholder="New Phone Number" value={phoneNumber} onChange={(e) => setphoneNumber(e.target.value)}/>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="dark" onClick = {() => onSubmit()} style = { { display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '100%' } }>Confirm Change</Button>
        </Modal.Footer>
    </Modal>
    );
  }

export default EditAccountPopup;