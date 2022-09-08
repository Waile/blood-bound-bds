import "bootstrap/dist/css/bootstrap.min.css";
import ChatScreenPopup from "./ChatScreenPopup";

import { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";

import { getSupport } from '../../actions/otherUsers';

function ContactSupport(props) {
    const [username, setUsername] = useState('');

    const dispatch = useDispatch();

    useEffect(() => props.Flag && dispatch(getSupport()).then((uName) => setUsername(uName)), [props.Flag]);

    return (
        <div>
            {
                username != '' &&
                (<ChatScreenPopup show={props.Flag} onHide={() => props.setFlag(false)} username={username} />)
            }
        </div>
    );
}

export default ContactSupport;