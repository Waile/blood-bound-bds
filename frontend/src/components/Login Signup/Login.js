import { useState, useEffect } from 'react';

import RegainPopup from './RegainPopup';
import Button from '../Button';
import './Login.css';

import * as api from '../../api';
import { setToken } from '../../actions/auth';

import { useDispatch } from "react-redux";

function Login(props) {
    const [userName, setuserName] = useState("");
    const [password, setPassword] = useState("");
    const [login, setLogin] = useState(false);
    const [error, setError] = useState("");
    const [modalRegain, setModalRegain] = useState(false);

    const dispatch = useDispatch();

    const cleanUp = () => {
        setuserName('');
        setPassword('');
        setLogin(false);
    }

    useEffect(() => {
        let isComponentMounted = true;
        if (login) {
            api.login({ username: userName, password }).then((res) => {
                if (isComponentMounted) {
                    cleanUp();
                    if (res.data.errorMessage) {
                        setError(res.data.errorMessage);
                        console.log(res.data.errorMessage);
                        return;
                    }
                    if (res.data.message == "Verify") {
                        setError("verify pls");
                        console.log("verify pls");
                        props.setId(res.data.id);
                        props.setModalVerify(true);
                        return; 
                    }
                    console.log('Login successful') //redirect to App.js
                    setLogin(false);
                    dispatch(setToken(res.data.token));
                }
            })
            .catch(error => console.log('Error: ', error))
        }
        return () => {
            isComponentMounted = false;
        }
    }, [login])

    const onSubmit = () => {
        setLogin(true);
    }

    const onKeyDown = (e) => {
        if (e.keyCode === 13) {
            onSubmit();
        }
    };

    return (
        <div className='wrapper'>
            <p className='p'>Please enter your username and password</p>
            <form className='form' onKeyDown={onKeyDown}>
                <label className='text'>Username</label>
                <input
                    className='inputfield'
                    type='text'
                    name='name'
                    onChange={(e) => setuserName(e.target.value)}
                    placeholder='Enter Username'
                    id='username'
                />
                <label className='text'>Password</label>
                <input
                    className='inputfield'
                    name='name'
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Enter Password'
                    id='password'
                    type='password'
                />
            </form>
            <Button text="Log in" onClick={onSubmit} id="login-button"></Button>
            <p className="text2">Forgot your Username/Password?</p>
            <Button text='I forgor 💀' id='forgot-button' onClick={() => setModalRegain(true)}/>
            <RegainPopup
                show = {modalRegain}
                onHide = {() => setModalRegain(false)}
            />  
        </div>
    )
}

export default Login;