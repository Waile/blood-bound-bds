import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import * as api from '../../api'

import { useState } from 'react';
import { useSelector } from 'react-redux';

function ChangePasswordPopup(props) {
    const [password, setPassword] = useState("");
    const [confirmedpassword, setConfirmedpassword] = useState("");
    const [passworderror, setPassworderror] = useState("");

    const user = useSelector((state) => state.user);

    const onSubmit = () => {
        console.log('Submitted');
        api.updateUser(user._id, {password: confirmedpassword, oldPassword: password}).then(res => {
            console.log('done')
            console.log(res.data)
            setPassworderror(res.data.errorMessage || '')
            props.onHide();
        }) //add a case for when the password fails verification
        .catch(error => console.log(error))
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
                <Form.Control type="password" placeholder="Current Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <Form.Control type="confirmedpassword" placeholder="New Password" value={confirmedpassword} onChange={(e) => setConfirmedpassword(e.target.value)}/>
                <Form.Label style = { { display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '50%', color: 'tomato' } }>{passworderror}</Form.Label>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="dark" onClick = {() => onSubmit()} style = { { display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '100%' } }>Confirm Change</Button>
        </Modal.Footer>
    </Modal>
    );
  }

export default ChangePasswordPopup;