import FileBase from 'react-file-base64';
import ImageContainer from '../ImageContainer';
import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import * as api from '../../api';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { assistiveSignUp } from '../../actions/user';

function SignupPopup(props) {
    //for the verification modal
    const freeChoice = !props.userTypeChosen;
    const [userType, setUserType] = useState(props.default);
    const [userTypeChosen, setUserTypeChosen] = useState(!freeChoice); //to make sure the user type is chosen
    const types = ["Blood Requester", "Blood Donor", "NGO Worker", "Medical Institution Worker"];
    const typeConversions = {"Blood Requester": "Blood_Requester", "Blood Donor": "Blood_Donor", "NGO Worker": "NGO_Worker", "Medical Institution Worker": "MI_Worker"};
    //for all account types
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedpassword, setConfirmedpassword] = useState("");
    //either or both email or phonenumber can be taken
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [bloodType, setBloodType] = useState("");
    const bloodTypesArr = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
    const [cnic, setCnic] = useState("");
    const [cnicPhoto, setCnicPhoto] = useState("");
    const [livePhoto, setLivePhoto] = useState("");
    //manadatory for type = NGO/MIW 
    const [verificationDocs, setVerificationDocs] = useState([""]);
    const [docCounter, setDocCounter] = useState([""]);
    //for validation
    const [errorMessages, setErrorMessages] = useState({ usernameError: "", passwordError: "", emailError: "", phoneNumberError: "", cnicError: "" })
    const [submit, setSubmit] = useState(false);

    const { accountsCreated } = useSelector((state) => state.user);

    const dispatch = useDispatch();

    const contactApi = (rawUser) => {
        if (freeChoice) {
            return api.signUp(rawUser);
        } else {
            return dispatch(assistiveSignUp(rawUser, accountsCreated));
        }
    }

    useEffect(() => {
        let isComponentMounted = true;

        if (submit) {
            const { user, allowed } = convertUser();
            if (allowed) {
                contactApi(user)
                .then(res => {
                    if (isComponentMounted) {
                        if (res.data?.errorMessage?.other){
                            alert(res.data.errorMessage.other);
                        } else if (res.data?.errorMessage) {
                            console.log(res.data.errorMessage)
                            setErrorMessages({ ...errorMessages, ...res.data.errorMessage });
                        } else {
                            alert("Account created!");
                            props.onHide();
                            props.setId(res.data._id);
                            props.setModalVerify(true);
                        }
                    }
                })
                .catch(error => console.log(error))
                .then(() => setSubmit(false))
            } else {
                setSubmit(false);
            }
        }

        return () => {
            isComponentMounted = false;
        }
    }, [submit])

    const convertUser = () => {
        const retVal = {allowed: false}
        if (username == "") {
            alert("Please choose a username.")
            return retVal;
        }
        if (firstName == "") {
            alert("Please enter your first name.")
            return retVal;
        }
        if (lastName == "") {
            alert("Please enter your last name.")
            return retVal;
        }
        if (!userTypeChosen) {
            alert("Please select your user type.")
            return retVal;
        }
        if (freeChoice && password == "") { //do not provide the password for assistive account-making.
            alert("Please enter your password.")
            return retVal;
        }
        if (freeChoice && confirmedpassword == "") {
            alert("Please confirm your password.")
            return retVal;
        }
        if (freeChoice && (confirmedpassword != password)) {
            alert("The password and confirmed password do not match.")
            return retVal;
        }
        if (email == "" && phoneNumber == "") {
            alert("Please enter at least an email or a phone number (or both).")
            return retVal;
        }
        if (bloodType == "") {
            alert("Please select your blood type.")
            return retVal;
        }
        if (cnic == "") {
            alert("Please enter your cnic number.")
            return retVal;
        }
        if (isNaN(Number(cnic))) {
            alert("Please enter a proper cnic number.")
            return retVal;
        }
        if (cnicPhoto == "") {
            alert("Please upload a photo of your cnic.")
            return retVal;
        }
        if (livePhoto == "") {
            alert("Please upload a live photo.")
            return retVal;
        }
        if ( (userType == "NGO_Worker" || userType == "MI_Worker") && verificationDocs.filter(doc => doc != "").length == 0 ) {
            alert("Please upload verification documents.")
            return retVal;
        }
        const user = {username, firstName, middleName, lastName, userType, password, email: (email != "" ? email: null), phoneNumber: (phoneNumber != "" ? phoneNumber : null), bloodType, cnic, cnicPhoto, livePhoto, verificationDocs: verificationDocs.filter(doc => doc != "")};
        return {allowed: true, user}
    }

    const onSubmit = () => {
        if (!submit) {
            setSubmit(true);
        }
        console.log("Submitted")
    }

    const onPlus = () => {
        if (docCounter.length < 5) {
            setDocCounter([...docCounter, 1]);
            setVerificationDocs([...verificationDocs, ""]);
        }
    }

    const onMinus = () => {
        const length = docCounter.length;
        if (length > 1) {
            setDocCounter([...docCounter.slice(0, length - 1)]);
            setVerificationDocs([...verificationDocs.slice(0, length - 1)]);
        }
    }

    const DocCounter = () => (
        <div>
            <Button id='reduce-photos' onClick={() => onMinus()}>Reduce Photos (-)</Button>
            <Button id='add-photos' onClick={() => onPlus()}>Add Photos (+)</Button>
        </div>
    )

    const uploadFile = (base64, index) => {
        setVerificationDocs([...verificationDocs.slice(0, index), base64, ...verificationDocs.slice(index + 1)]);
    }

    const VerificationImages = () => (
        <div>
            {userType == "Blood_Donor" ? `Documents Showing the last time ${freeChoice ? `you` : `the user`} donated blood (if any)` : `Photos of documents to prove that ${freeChoice ? `you belong to` : `the user is part of`} an NGO/Medical Institution.`}
            <DocCounter/>
            {
                docCounter.map((num, index) => (
                    <div key={index} id={`verification-photo-${index}`}>
                        <br/>
                        <FileBase type="file" multiple={false} onDone={({ base64 }) => uploadFile(base64, index)}/>
                        <ImageContainer image={verificationDocs[index] != "" ? verificationDocs[index] : null}/>
                    </div>
                ))
            }
        </div>
    )

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
                    Create Account
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {
                        //if the user type is flexible, then this is a proper sign up.
                        //else, it is an assisted sign up
                        freeChoice && <div key={`inline-radio`} className="mb-3">
                            <label>Account Type:</label>
                            <br/>
                            {
                                types.map((aType, index) => (
                                    <Form.Check
                                        onClick = { (e) => {setUserType(typeConversions[e.target.id]); setUserTypeChosen(true)} }
                                        inline
                                        name = 'account type'
                                        label = {`${aType}`}
                                        type = 'radio'
                                        id = {`${aType}`}
                                        key = {aType}
                                    />
                                ))
                            }
                        </div>
                    }
                    <Form.Group className="mb-3">
                        <Form.Control  id="username" type="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                        <Form.Control id="firstname" type="firstname" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                        <Form.Control id="middlename" type="middlename" placeholder="Middle Name" value={middleName} onChange={(e) => setMiddleName(e.target.value)}/>
                        <Form.Control id="lastname" type="lastname" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                        <Form.Label style = { { display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '50%', color: 'tomato' } }>{errorMessages.usernameError}</Form.Label>
                    </Form.Group>
                    {
                        freeChoice && <div>
                            <Form.Group className="mb-3">
                                <Form.Control id="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                                <Form.Control id="confirm-password" type="password" placeholder="Confirm Password" value={confirmedpassword} onChange={(e) => setConfirmedpassword(e.target.value)}/>
                                <Form.Label style = { { display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '50%', color: 'tomato' } }>{errorMessages.passwordError}</Form.Label>
                            </Form.Group>
                        </div>
                    }
                    <div key={`inline-checkbox`} className="mb-3">
                        <label>Blood Type:</label>
                        <br/>
                        {
                            bloodTypesArr.map((bType, index) => (
                                <Form.Check 
                                    onClick = {(e) => setBloodType(e.target.id) }
                                    inline
                                    name = "blood type"
                                    label={`${bType}`}
                                    type='radio'
                                    id={`${bType}`}
                                    key={bType}
                                />
                            ))
                        }
                    </div>
                    <Form.Group className="mb-3">
                        <Form.Control id="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <Form.Label style = { { display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '50%', color: 'tomato' } }>{errorMessages.emailError}</Form.Label>
                        <Form.Control id="phonenumber" type="phonenumber" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
                        <Form.Label style = { { display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '50%', color: 'tomato' } }>{errorMessages.phoneNumberError}</Form.Label>
                        <Form.Control id= "cnic" type="cnic" placeholder="CNIC" value={cnic} onChange={(e) => setCnic(e.target.value)}/>
                        <Form.Label style = { { display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '50%', color: 'tomato' } }>{errorMessages.cnicError}</Form.Label>
                        
                        <div id="cnicPhoto">
                            {`A photo of ${freeChoice ? `your` : `the user's`} cnic:`}
                            <br/>
                            <FileBase type="file" multiple={false} onDone={({ base64 }) => setCnicPhoto(base64)} />
                            <ImageContainer image={cnicPhoto != "" ? cnicPhoto : null}/>
                        </div>

                        <div id="livePhoto">
                            {`Live Photo (Passport type photograph of ${freeChoice ? `your` : `the user's`} face):`}
                            <br/>
                            <FileBase type="file" multiple={false} onDone={({ base64 }) => setLivePhoto(base64)} />
                            <ImageContainer image={livePhoto != "" ? livePhoto : null}/>
                        </div>

                        {
                            (userType != 'Blood_Requester' && userType != 'Customer_Support') && VerificationImages()
                        }

                    </Form.Group>
                    <Button id="submit" variant="dark" onClick={() => onSubmit()} style = { { display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '100%' } }>Submit</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
  }

export default SignupPopup;