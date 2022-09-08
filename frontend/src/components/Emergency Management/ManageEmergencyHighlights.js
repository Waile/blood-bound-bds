import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';

import { parseDate } from '../../utils/utils';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateEmergencyPost } from '../../actions/emergencyPosts';

function ManageEmergencyHighlights(props) {
    const [id, setId] = useState('');

    const ePosts = useSelector((state) => state.emergencyPosts);

    const dispatch = useDispatch();

    useEffect(() => (id != '') && dispatch(updateEmergencyPost(id, { isActive: false })).then(() => setId('')), [id]);

    const onInactivate = (index) => setId(ePosts[index]._id)

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
                    Emergency Highlights
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Accordion>
                    {
                        ePosts.map((post, index) => (
                            <Accordion.Item eventKey={`${index}`} key={index}>
                                <Accordion.Header>Date Created: {parseDate(post.created)}</Accordion.Header>
                                <Accordion.Body as={'span'}>Location: {`\n${post.locations}`} </Accordion.Body>
                                <Accordion.Body as={'span'}>Blood Types: {`\n${post.bloodTypes.join(',')}`} </Accordion.Body>
                                <Accordion.Body>{`\n${post.body}`} </Accordion.Body>
                                <Accordion.Body style={{paddingLeft:'572px'}}>
                                <Button variant="danger" onClick = {() => onInactivate(index)}>Inactivate</Button>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))
                    }
                </Accordion>
            </Modal.Body>
        </Modal>
    );
  }

export default ManageEmergencyHighlights;