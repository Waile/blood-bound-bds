import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';

function ChatMessageSender(props) {
    const [message, setMessage] = useState('');

    const onSubmit = () => {
        props.onSubmit(message);
        setMessage('');
    }

    const onKeyDown = (e) => {
        if (e.keyCode === 13) {
            onSubmit();
        }
    }

    return (
        <form>
            <div style={{bottom:'5px', width:'98.35%', position:'absolute'}}>
                <textarea style={{width:'94%', float:'left',
                                paddingTop:'5px', paddingBottom:'5px', paddingLeft:'5px', paddingRight:'5px'}}
                                rows={3} value={message} placeholder='Enter your message here.' onChange={(e) => setMessage(e.target.value)} onKeyDown={e => onKeyDown(e)}></textarea>
                <Button style={{width:'5.46%', float:'right', marginTop:'10px'}} variant="dark" onClick = {() => onSubmit()}>Send</Button>
                <label style={{marginLeft:'8px'}}>Size &nbsp;
                    <select value={props.Size.value} onChange={(e) => props.setSize({value: e.target.value})}>
                        <option value="50%">50%</option>
                        <option value="75%">75%</option>
                        <option value="100%">100%</option>
                        <option value="125%">125%</option>
                        <option value="150%">150%</option>
                    </select>
                </label>
            </div>
        </form>
    );
}

export default ChatMessageSender;