import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import * as api from '../../api';

function AccountCreationVerificationPopup(props) {
    const [emailCode, setEmailCode] = useState("");
    const [phoneCode, setPhoneCode] = useState("");
    const [submit, setSubmit] = useState(false);
    const [code, setCode] = useState(false);

    useEffect(() => {
        let isComponentMounted = true;
        if (submit && code != "") {
            api.verifyCode(props.id, { code })
            .then(res => {
                if (isComponentMounted) {
                    let alertString = "";
                    if (res.data?.message == "OK") {
                        alertString += "Your verification code has been accepted."
                        if (res.data.canLogin) {
                            alertString += " You may now login."
                        }
                    } else {
                        alertString += "Incorrect verification code."
                    }
                    alert(alertString);
                }
            })
            .catch(error => console.log(error))
            .then(() => {
                setCode(""); 
                setSubmit(false);
            });
        }

        return () => {
            isComponentMounted = false;
        }
    }, [submit, code])

    const onSubmit = (option) => {
        setSubmit(true);
        setCode(option + (option == "E-" ? emailCode : phoneCode));
    }

    const onResend = (option) => {
        api.resendCode(props.id, { option })
        .then(() => alert('Code resent!'))
        .catch(error => console.log(error))
    }

    return (
    <Modal
        show = {props.show}
        onHide = {props.onHide}
        dialogClassName="modal-50w"
        centered
        style = {{backgroundColor: '#C0C0C0A6'}}
    >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Verify Account
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Label>A code has sent been sent to your provided email and/or phone number.</Form.Label>
                <Form.Label>Please enter the code(s) below:</Form.Label>
                <br/>Email:<br/>
                <Row className="align-items-center">
                    <Col sm={7}>
                        <Form.Control className="mb-2" id="inlineFormInput" placeholder="E-12345" value={"E-" + emailCode} onChange={(e) => setEmailCode(e.target.value.slice(2))} />
                    </Col>
                    <Col sm={3}>
                        <Button variant="dark" className="mb-2" id="inlineFormInput" onClick={() => onSubmit("E-")} style={{marginTop:'20px', marginLeft:'15px'}}>Confirm</Button>
                        <Button variant="dark" className="mb-2" id="inlineFormInput" onClick={() => onResend("E")} style={{marginTop:'-75px', marginLeft:'110px'}}>Resend</Button>
                    </Col>
                </Row>
                <br/>Phone Number:<br/>
                <Row className="align-items-center">
                    <Col sm={7}>
                        <Form.Control className="mb-2" id="inlineFormInput" placeholder="P-12345" value={"P-" + phoneCode} onChange={(e) => setPhoneCode(e.target.value.slice(2))} />
                    </Col>
                    <Col sm={3}>
                        <Button variant="dark" className="mb-2" id="inlineFormInput" onClick={() => onSubmit("P-")} style={{marginTop:'20px', marginLeft:'15px'}}>Confirm</Button>
                        <Button variant="dark" className="mb-2" id="inlineFormInput" onClick={() => onResend("P")} style={{marginTop:'-75px', marginLeft:'110px'}}>Resend</Button>
                    </Col>
                </Row>
            </Form>
        </Modal.Body>
    </Modal>
    );
  }

export default AccountCreationVerificationPopup;