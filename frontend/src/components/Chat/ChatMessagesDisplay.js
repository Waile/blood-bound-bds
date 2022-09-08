import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useRef } from 'react';
import ChatMessage from "./ChatMessage";

import { useDispatch, useSelector } from "react-redux";

import { getMessagesById } from "../../actions/chatMessages";

function ChatMessagesDisplay(props) {
    const myRef = useRef(null);

    const chatIds = useSelector((state) => state.chats[props.chat?._id]?.chatMessages || []);

    const chatMessages = useSelector((state) => chatIds.map(id => state.chatMessages[id]));

    const messageIdArray = useSelector((state) => chatIds.filter(_id => state.chatMessages[_id] == null)); //the slicing ensures that messages already present are not queried for again

    const dispatch = useDispatch();
    
    const scrollToRef = () => myRef.current.scrollIntoView(); 
    
    useEffect(() => {
        if (messageIdArray.length > 0) {
            dispatch(getMessagesById(messageIdArray));
        }
        chatIds.length && scrollToRef();
    }, [props.chat])

    return (
        <div style={{overflow:'auto', borderStyle:'groove', height:'91%'}}>
            {
                chatMessages.map((chatMessage, index) => (
                    <div key={index} ref={myRef}>
                        { 
                            chatMessage && 
                            <ChatMessage author={chatMessage.author} viewer={props.sender} message={chatMessage.body} date={chatMessage.date} textsize={props.textsize}/> 
                        }
                        <br/><br/><br/><br/>
                    </div>
                ))
            }
        </div>
    );
}

export default ChatMessagesDisplay;