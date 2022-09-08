import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Figure from 'react-bootstrap/Figure';
import ProfileImage from '../../images/profileicon.svg';
import ReportPopup from '../ReportPopup'

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getOtherUser } from '../../actions/otherUsers';

import { getUsers } from '../../utils/utils';

const defaultUser = { username: '', firstName: '', middleName: '', lastName: '', bloodType: '' };

function OtherProfilePopup(props) {
    const [modalReport, setModalReport] = useState(false);

    const otherUsers = useSelector((state) => state.otherUsers);
    const arr = getUsers(otherUsers, ({ username }) => username == props.username);
    const user = arr.length > 0 ? arr[0] : defaultUser;

    const dispatch = useDispatch();

    useEffect(() => dispatch(getOtherUser(props.username)), []);

    return (
        <Modal
            show = {props.show}
            onHide = {props.onHide}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    User's Profile
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <Figure style = { { display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '50%'} }>
                        <Figure.Image
                            width={128}
                            height={128}
                            src={user.livePhoto} 
                        />
                    </Figure>
                    <Form.Label>Username: {user.username}</Form.Label>
                    <br/>
                    <Form.Label>Full Name: {user.firstName} {user.middleName || ''} {user.lastName}</Form.Label>
                    <br/>
                    <Form.Label>Blood Type: {user.bloodType}</Form.Label>
                    <Button variant="danger" style = { { display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '100%' } } onClick={() => setModalReport(true)}>Report User</Button>
                    <ReportPopup show={modalReport} username={props.username} onHide={() => setModalReport(false)}/>
                </Form.Group>
            </Modal.Body>
        </Modal>
    );
  }

export default OtherProfilePopup;