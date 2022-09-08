import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import "bootstrap/dist/css/bootstrap.min.css";
import ListGroup from 'react-bootstrap/ListGroup'
import ChatScreenPopup from "./ChatScreenPopup";

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getChatsbyId, updateChat } from '../../actions/chats';

function ChatListPopup(props) {
    const [modalChats, setModalChats] = useState([]);
    const [updates, setUpdates] = useState({ visible: true, index: -1 });
    
    const user = useSelector((state) => state.user);

    const allChats = [ ...user.userChatsWithUser, ...user.userChatsWithSupport, ...user.supportChatsWithUser ];
    const chats = useSelector(
        (state) => 
        allChats
        .map((id) => state.chats[id])
        .filter(chat => chat != null) //don't want them to be null at the start
    );    

    const dispatch = useDispatch();

    useEffect(() => (allChats.length > 0) && dispatch(getChatsbyId(allChats, user)), []);

    useEffect(() => {
        const { index , visible } = updates;
        if (updates.index != -1) {
            dispatch(updateChat(chats[index]._id, { visible }, user));
            setUpdates({ visible: true, index: -1 });
        }
    }, [updates]);

    const updateModalArray = (index, val) => {
        setModalChats(chats.map((chat, ind) => ind == index ? val : false));
        //keeps modal array in sync with the chat array as well.
        //otherwise, when removing a chat, we'd have to remove its index from this arr as well.
    }

    const resolve = (index) => {
        setUpdates({ visible: false, index })
    }

    const unresolve = (index) => {
        setUpdates({ visible: true, index })
    }

    return (
        <div>
            <Modal
                show = {props.show}
                onHide = {props.onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Chat List
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        {
                            chats.map((chat, index) => (
                                <ListGroup.Item key={index}>
                                    <div style={{cursor:'pointer'}} onClick={() => updateModalArray(index, true)}>
                                        <span>Chat with {chat.username1 + chat.username2}</span>
                                    </div>
                                    {
                                        chat.visible 
                                        ? (user.userType == 'Customer_Support' && <Button style={{position:'absolute', right:'5px', bottom:'0px'}} size='sm' variant='success' onClick={() => resolve(index)}>Mark As Resolved</Button>)
                                        : (user.userType == 'Customer_Support' && <Button style={{position:'absolute', right:'5px', bottom:'0px'}} size='sm' variant='danger' onClick={() => unresolve(index)}>Mark As Unresolved</Button>)
                                    }
                                    <ChatScreenPopup key={chat._id} show={modalChats?.[index]} onHide={() => updateModalArray(index, false)} _id={chat._id} username={chat.username1 + chat.username2} />
                                    {
                                        /*without the key, react does not re-render properly if, say, the chat at index 2 gets hit by onResolve.
                                        Then, the chat at index 3 shifts to index 2, but react does not fix the chat screen popup (it's still what index 2 used to have).
                                        Hence, we need the key to force react to fix it. I think.*/
                                    }
                                </ListGroup.Item>
                            ))
                        }
                    </ListGroup>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default ChatListPopup;