import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";

import ChatMessagesDisplay from './ChatMessagesDisplay';
import ChatMessageSender from './ChatMessageSender';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addMessage, createChat, getChat, removeChat } from '../../actions/chats';

function ChatScreenPopup(props) {
    const [_id, set_Id] = useState(props._id || null);
    const [message, setMessage] = useState('');
    const [textsize, setTextsize] = useState({value: '100%'});
    const [resolve, setResolve] = useState(-1);
    
    const user = useSelector((state) => state.user);
    
    const chat = useSelector((state) => state.chats[_id] || { _id, chatMessages: [] });
    
    const dispatch = useDispatch();

    const getFilters = () => {
        let filters = {};
        if (!_id) {
            filters = { usernames: [props.username, user.username], associatedPost: props.id };
        } else { //either the _id was provided in props, or the chat window needs to be refreshed when opened.
            filters = { _id };
        }
        return filters;
    }

    useEffect(() => props.show && dispatch(getChat(getFilters(), user)).then((id) => set_Id(id)), [props.show]); //might replace this with an empty array if we can make dynamic refershes to chat.

    useEffect(() => {
        if (resolve != -1) {
            props.onHide();
            dispatch(removeChat(resolve));
            setResolve(-1);
        }
    }, [resolve])

    const onResolve = () => {
        setResolve(_id);
    }

    const sendMessage = () => {
        const chatMessage = { body: message, author: user.username, date: new Date() };
        if (_id) {
            return dispatch(addMessage(_id, chatMessage))
            .then((errorMessage) => errorMessage != null ? onResolve() : null); //resolve if there is an error message
        } else {
            const chatInfo = { username1: props.username, username2: user.username, associatedPost: props.id };
            return dispatch(createChat(chatInfo, chatMessage, user))
            .then((id) => set_Id(id));
        }
    }

    useEffect(() => message != '' && sendMessage().then(() => setMessage('')), [message])

    const onSubmit = (message) => {
        setMessage(message);
    }

    const setSize = (textsize) => {
        setTextsize(textsize);
    }

    return (
        <Modal
            show = {props.show}
            onHide = {props.onHide}
            fullscreen = {true}
        >
            <Modal.Header closeButton>
                <Modal.Title>
					Contacting {props.username}
				</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ChatMessagesDisplay sender={user.username} chat={chat} textsize={textsize}/>
                <ChatMessageSender 
                    receiver={props.username} 
                    sender={user.username} 
                    onSubmit={(message) => onSubmit(message)}
                    Height={window.innerHeight} 
                    Width={window.innerWidth} 
                    Size={textsize} 
                    setSize={(textsize) => setSize(textsize)}
                />
            </Modal.Body>
        </Modal>
    );
}

export default ChatScreenPopup;