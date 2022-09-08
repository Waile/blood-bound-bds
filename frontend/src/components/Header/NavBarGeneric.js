import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Offcanvas, Figure, Row, Col, InputGroup, Form, Nav, Navbar, Button, FormControl } from 'react-bootstrap';
import { useState } from "react";
import ProfilePopup from '../Profile/ProfilePopup';

//for everyone
import BellIcon from '../../images/bellicon.svg';
import BellFillIcon from '../../images/bellfillicon.svg';
import NotificationsPopup from "./NotificationsPopup";

//For everyone except Customer Support.
import MapIcon from '../../images/mapicon.svg';
import DisplayMapRadialRequests from "../Map Stuff/DisplayMapRadialRequests";

//Admin imports.
import EmergencyHighlightPopup from '../Emergency Management/EmergencyHighlightPopup';
import ManageReportedUsersPopup from '../Manage Other Users (Admin)/ManageReportedUsersPopup';
import VerifyNGOMIUsersPopup from '../Manage Other Users (Admin)/VerifyNGOMIUsersPopup';
import ManageEmergencyHighlights from "../Emergency Management/ManageEmergencyHighlights";
import ManageDeletionRequestsPopup from "../Manage Other Users (Admin)/ManageDeletionRequestsPopup";
import ManageBloodDonorsPopup from "../Manage Other Users (NGO MI)/ManageBloodDonorsPopup"; //Also gets used by NGO and MI Workers
import SignupPopup from "../Login Signup/SignupPopup";

//NGO/MI imports.
import OnboardingPopup from '../Manage Other Users (NGO MI)/OnboardingPopup';
import ContactSupport from "../Chat/ContactSupport"; //Also gets used by Blood Donors and Requesters

//BD/BR imports.
import RequestsCreatedPopup from '../NavBar Requests/RequestsCreatedPopup';
import RequestsFulfilledPopup from '../NavBar Requests/RequestsFulfilledPopup';
import ChatListPopup from "../Chat/ChatListPopup";

//Support imports.
import ProfileIcon from '../../images/profileicon.svg';
import LogoutIcon from '../../images/logouticon.svg';
import EmptyChatIcon from '../../images/supporticonempty.svg';
import ChatIcon from '../../images/supporticon.svg';

import { useSelector } from "react-redux";

function NavBarGeneric(props) {
    const [modalShowEmergency, setModalShowEmergency] = useState(false);
    const [modalShowReported, setModalShowReported] = useState(false);
    const [modalShowVerifyAdmin, setModalShowVerifyAdmin] = useState(false);
    const [modalShowOnboarding, setModalShowOnboarding] = useState(false);
    const [modalShowRequests, setModalShowRequests] = useState(false);
    const [modalShowRequestsFulfilled, setModalShowRequestsFulfilled] = useState(false);
    const [modalShowManageEmergency, setModalShowManageEmergency] = useState(false);
    const [modalShowManageDonors, setModalShowManageDonors] = useState(false);
    const [modalShowManageDeletions, setModalShowManageDeletions] = useState(false);
    const [modalShowChatList, setModalShowChatList] = useState(false);
    const [contactSupportFlag, setContactSupportFlag] = useState(false);
    const [modalCreateAccount, setModalCreateAccount] = useState(false);
    const [modalMapRequest, setModalMapRequests] = useState(false);
    const [modalNotifications, setModalNotifications] = useState(false);

    const [filters, setFilters] = useState('');

    const { username, userType, notifications } = useSelector((state) => state.user);

    const [newNotifications, setNewNotifications] = useState((notifications || []).length > 0);

    const onSubmit = (e) => {
        e.preventDefault();
        props.setSearchParams({ ...props.searchParams, filters, page: 1 });
    }

    const SearchBar = () => (
        <InputGroup style=
            {
                (userType != 'Customer_Support') 
                ? { width:'1325px', marginLeft:'65px'} 
                : { width:'1325px', marginLeft:'100px' }
            }
        >
            <FormControl
                placeholder="Search for requests here..."
                aria-label="Search for requests here..."
                aria-describedby="basic-addon2"
                value={filters}
                autoFocus="autoFocus"
                onChange={e => setFilters(e.target.value)}
            />
            <Button variant='dark' style={{ height:'40px', width:'32', marginTop:'19px' }} onClick={onSubmit}>
                Search
            </Button>
            <Figure style={{ paddingRight:'5px', marginTop:'25px' }}>
                <Figure.Image
                    width={32}
                    height={32}
                    src={newNotifications ? BellFillIcon : BellIcon}
                    onClick={() => setModalNotifications(true)}
                    style={{cursor:'pointer'}}
                />
            </Figure>
            <NotificationsPopup
                show = {modalNotifications}
                onHide = {() => setModalNotifications(false)}
                setNewNotifications = {setNewNotifications}
                //the stuff below is for when a donor is looking for posts they can complete
                onFulfill = {props.onFulfill}
                setModalShowProfile = {props.setModalShowProfile}
            />
        </InputGroup>
    )

    return (
        <div>
            {
            userType == 'Admin' && <Navbar fixed='top' bg="danger" expand={false}>
            <Container fluid>
                <Navbar.Brand>BloodBound</Navbar.Brand>
                <Row className="g-2">
                    {SearchBar()} {/*prevents re-rendering when the search value changes*/}
                </Row>
                <Figure style={{ marginTop:'25px' }}>
                    <Figure.Image
                        width={32}
                        height={32}
                        src={MapIcon}
                        onClick = {() => setModalMapRequests(true)}
                        style={{cursor:'pointer'}}
                    />
                </Figure>
                <Navbar.Toggle aria-controls="offcanvasNavbar" />
                <Navbar.Offcanvas
                id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel"
                placement="end"
                bg="dark"
                >
                <Offcanvas.Header bg="dark" closeButton>
                    <Offcanvas.Title id="offcanvasNavbarLabel">{userType}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                        <Nav.Link onClick = {() => props.setModalShowProfile(true)} >Profile</Nav.Link>
                        <Nav.Link onClick = {() => setModalShowEmergency(true)} >Create Emergency Highlight</Nav.Link>
                        <Nav.Link onClick = {() => setModalShowManageEmergency(true)} >Manage Emergency Highlights</Nav.Link>
                        <Nav.Link onClick = {() => setModalCreateAccount(true)}>Create Support Account</Nav.Link>
                        <Nav.Link onClick = {() => setModalShowReported(true)} >Manage Reported Users</Nav.Link>
                        <Nav.Link onClick = {() => setModalShowManageDonors(true)} >Manage Blood Donors</Nav.Link>
                        <Nav.Link onClick = {() => setModalShowVerifyAdmin(true)} >Verify NGO/Medical Institution Worker Users</Nav.Link>
                        <Nav.Link onClick = {() => setModalShowManageDeletions(true)}>Manage Deletion Requests</Nav.Link>
                        <Nav.Link onClick = {() => props.nullifyToken()} >Logout</Nav.Link>
                    </Nav>
                </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
            </Navbar> 
            }

            {
                userType == 'Admin' && <EmergencyHighlightPopup
                    show={modalShowEmergency}
                    onHide={() => setModalShowEmergency(false)}
                />
            }

            {
                userType == 'Admin' && <ManageReportedUsersPopup
                    show={modalShowReported}
                    onHide={() => setModalShowReported(false)}
                    setModalShowProfile={props.setModalShowProfile}
                />
            }

            {
                userType == 'Admin' && <VerifyNGOMIUsersPopup
                    show={modalShowVerifyAdmin}
                    onHide={() => setModalShowVerifyAdmin(false)}
                />
            }

            {
                userType == 'Admin' && <ManageEmergencyHighlights
                    show={modalShowManageEmergency}
                    onHide={() => setModalShowManageEmergency(false)}
                />
            }

            {
                userType == 'Admin' && <ManageDeletionRequestsPopup
                    show={modalShowManageDeletions}
                    onHide={() => setModalShowManageDeletions(false)}
                />
            }

            {
                (userType == 'NGO_Worker' || userType == 'MI_Worker' || userType == 'Admin') && <ManageBloodDonorsPopup
                    show={modalShowManageDonors}
                    onHide={() => setModalShowManageDonors(false)}
                />
            }

            { (userType == 'NGO_Worker' || userType == 'MI_Worker') && <Navbar fixed='top' bg="danger" expand={false}>
            <Container fluid>
                <Navbar.Brand>BloodBound</Navbar.Brand>
                <Row className="g-2">
                    {SearchBar()}
                </Row>
                <Figure style={{ marginTop:'25px' }}>
                    <Figure.Image
                        width={32}
                        height={32}
                        src={MapIcon}
                        onClick = {() => setModalMapRequests(true)}
                        style={{cursor:'pointer'}}
                    />
                </Figure>
                <Navbar.Toggle aria-controls="offcanvasNavbar" />
                <Navbar.Offcanvas
                id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel"
                placement="end"
                >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title id="offcanvasNavbarLabel">{userType}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                        <Nav.Link onClick = {() => props.setModalShowProfile(true)} >Profile</Nav.Link>
                        <Nav.Link onClick = {() => setModalCreateAccount(true)}>Create Blood Donor Accounts</Nav.Link>
                        <Nav.Link onClick = {() => setModalShowOnboarding(true)} >Onboard Blood Donors</Nav.Link>
                        <Nav.Link onClick = {() => setModalShowManageDonors(true)}>Manage Blood Donors</Nav.Link>
                        <Nav.Link onClick = {() => setContactSupportFlag(true)} >Contact Customer Support</Nav.Link>
                        <Nav.Link onClick = {() => props.nullifyToken()} >Logout</Nav.Link>
                    </Nav>
                </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
            </Navbar> }

            {
                (userType == 'NGO_Worker' || userType == 'MI_Worker') && <OnboardingPopup
                    show={modalShowOnboarding}
                    onHide={() => setModalShowOnboarding(false)}
                />
            }

            {
                ((userType == 'NGO_Worker' || userType == 'MI_Worker') && contactSupportFlag == true) && <ContactSupport
                    Flag={contactSupportFlag}
                    setFlag={() => setContactSupportFlag(false)}
                />
            }

            {
                (userType == 'NGO_Worker' || userType == 'MI_Worker' || userType == 'Admin') && 
                <SignupPopup
                    show={modalCreateAccount}
                    onHide={() => setModalCreateAccount(false)}
                    userTypeChosen={true}
                    default={userType == 'Admin' ? 'Customer_Support' : 'Blood_Donor'}
                    setId={(id) => null}
                    setModalVerify={(flag) => null}
                    //don't need the last two for this
                />
            }

            { (userType == 'Blood_Donor' || userType == 'Blood_Requester') && <Navbar bg="danger" fixed='top' expand={false}>
            <Container fluid>
                <Navbar.Brand>BloodBound</Navbar.Brand>
                <Row className="g-2">
                    {SearchBar()}
                </Row>
                <Figure style={{ marginTop:'25px' }}>
                    <Figure.Image
                        width={32}
                        height={32}
                        src={MapIcon}
                        onClick = {() => setModalMapRequests(true)}
                        style={{cursor:'pointer'}}
                    />
                </Figure>
                <Navbar.Toggle aria-controls="offcanvasNavbar" />
                <Navbar.Offcanvas
                id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel"
                placement="end"
                >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title id="offcanvasNavbarLabel">{userType}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                        <Nav.Link onClick = {() => props.setModalShowProfile(true)} >Profile</Nav.Link>
                        <Nav.Link onClick = {() => setModalShowRequests(true)} >Requests Created</Nav.Link>
                        <Nav.Link onClick = {() => setModalShowRequestsFulfilled(true)} >Requests Fulfilled</Nav.Link>
                        <Nav.Link onClick = {() => setModalShowChatList(true)} >Chats</Nav.Link>
                        <Nav.Link onClick = {() => setContactSupportFlag(true)} >Contact Customer Support</Nav.Link>
                        <Nav.Link onClick = {() => props.nullifyToken()} >Logout</Nav.Link>
                    </Nav>
                </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
            </Navbar> }

            {
                (userType == 'Blood_Donor' || userType == 'Blood_Requester') && <RequestsCreatedPopup
                    show={modalShowRequests}
                    onHide={() => setModalShowRequests(false)}
                    username={username}
                />
            }

            {
                (userType == 'Blood_Donor' || userType == 'Blood_Requester') && <RequestsFulfilledPopup
                    show={modalShowRequestsFulfilled}
                    username={username}
                    onHide={() => setModalShowRequestsFulfilled(false)}
                />
            }

            {
                (userType == 'Blood_Donor' || userType == 'Blood_Requester') && <ChatListPopup
                    show={modalShowChatList}
                    onHide={() => setModalShowChatList(false)}
                />
            }

            {
                ((userType == 'Blood_Donor' || userType == 'Blood_Requester') && contactSupportFlag == true) && <ContactSupport
                    Flag={contactSupportFlag}
                    setFlag={() => setContactSupportFlag(false)}
                />
            }

            { userType == 'Customer_Support' && <Navbar fixed='top' bg="danger" expand={false}>
            <Container fluid>
                <Navbar.Brand>BloodBound</Navbar.Brand>
                {SearchBar()}
                <Figure style={{ paddingLeft:'5px', marginTop:'25px' }}>
                    <Figure.Image
                        width={32}
                        height={32}
                        src={ProfileIcon}
                        onClick = {() => props.setModalShowProfile(true)}
                        style={{cursor:'pointer'}}
                    />
                </Figure>
                <Figure style={{ paddingLeft:'5px', paddingRight:'5px', marginTop:'25px' }}>
                    <Figure.Image
                        width={31}
                        height={31}
                        src={ChatIcon}
                        style={{cursor:'pointer'}}
                        onClick={() => setModalShowChatList(true)}
                    />
                </Figure>
                {/* <Figure style={{ paddingLeft:'5px', paddingRight:'5px', marginTop:'25px' }}> For when there are no unread chats for Support folk.
                    <Figure.Image
                        width={31}
                        height={31}
                        src={EmptyChatIcon}
                        style={{cursor:'pointer'}}
                    />
                </Figure> */}
                <Figure style={{ paddingRight:'5px', marginTop:'25px' }}>
                    <Figure.Image
                        width={32}
                        height={32}
                        src={LogoutIcon}
                        onClick={() => props.nullifyToken()}
                        style={{cursor:'pointer'}}
                    />
                </Figure>
            </Container>
            </Navbar> }

            <ProfilePopup 
                show = {props.modalShowProfile}
                onHide = {() => props.setModalShowProfile(false)}
                nullifyToken={() => props.nullifyToken()}
            />

            <DisplayMapRadialRequests
                isDonor = {true}
                show = {modalMapRequest}
                onHide = {() => setModalMapRequests(false)}
                //the stuff below is for when a donor is looking for posts they can complete
                onFulfill = {props.onFulfill}
            />

            {
                userType == 'Customer_Support' && <ChatListPopup
                    show={modalShowChatList}
                    onHide={() => setModalShowChatList(false)}
                />
            }
        </div>
    );
}

export default NavBarGeneric;