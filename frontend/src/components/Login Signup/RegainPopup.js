import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, { useEffect, useState } from 'react';

import * as api from '../../api';

function RegainPopup(props) {

    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [submit, setSubmit] = useState(false);

    useEffect(() => {
        let isComponentMounted = true;
        if (submit) {
            api.forgot({ email, phoneNumber })
            .then(res => {
                if (isComponentMounted) {
                    if (res?.data?.errorMessage) {
                        console.log(res.data.errorMessage);
                        return;
                    }
                    alert('The details have been sent to the specified email/ phone number.');
                    setEmail("");
                    setPhoneNumber("");
                    props.onHide();
                }
            })
            .catch(error => console.log(error))
            .then(() => setSubmit(false));
        }

        return () => {
            isComponentMounted = false;
        }
    }, [submit])

    const onSubmit = () => {
        setSubmit(true);
    }

    return (
        <Modal
            show = {props.show}
            onHide = {props.onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            style = {{backgroundColor: '#C0C0C0A6'}}
        >
            <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Regain Account Access
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Label>Enter either your email address or phone number.</Form.Label>
                    <Form.Label>Your username and password will be sent to them in a few minutes.</Form.Label>
                    <Form.Group className="mb-3" controlId="formBasicEmail" id="email-input">
                        <Form.Control type="Email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicNumber" id='phone-input'>
                        <Form.Control type="PhoneNumber" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
                    </Form.Group>
                    <Button id='submit-button' variant="dark" onClick={() => onSubmit()} style = { { display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '100%' } }>Submit</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
  }

export default RegainPopup;