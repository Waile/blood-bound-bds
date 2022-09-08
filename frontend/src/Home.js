import React, { useState } from 'react';

import './Home.css';
import Button from 'react-bootstrap/Button'
import Login from './components/Login Signup/Login';
import SignupPopup from './components/Login Signup/SignupPopup';
import AccountCreationVerificationPopup from './components/Login Signup/AccountCreationVerificationPopup';

import Logo from './images/Logo.png';

const Home = (props) => {
    const [modalSignup, setModalSignup] = useState(false);
    const [id, setId] = useState("");
    const [modalVerify, setModalVerify] = useState(false);
    
    const TopBar = () => {
        return( 
            <div className="TopBar">
                <div>
                    <Button id='signup-button' variant="outline-danger" onClick={() => setModalSignup(true)} style={{ width:'120px'}} size="lg">Sign Up</Button>{' '}
                </div>
            </div>
        )
    }

    return (
        <div className="container-fluid Body">
            <TopBar />
            <div className='right-half'>
                <Login
                    setToken = {props.setToken}
                    setId = {setId}
                    setModalVerify = {setModalVerify}
                />
            </div>
            <div className='left-half'>
                <img src={Logo} alt="" className="logo" width={"25%"} height={"25%"} />
            </div>
            <SignupPopup 
                show = {modalSignup}
                onHide = {() => setModalSignup(false)}
                setId = {setId}
                setModalVerify = {setModalVerify}
                userTypeChosen = {false} //the user must actually select one type
                default = {"Blood_Requester"}
            />
            <AccountCreationVerificationPopup
                show = {modalVerify}
                onHide = {() => setModalVerify(false)}
                id = {id}
            />
        </div>
    )
}

export default Home;