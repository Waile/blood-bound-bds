import Header from "./components/Posts/Header";
import Posts from "./components/Posts/Posts";
import NavBarGeneric from "./components/Header/NavBarGeneric";
import Pagination from 'react-bootstrap/Pagination';
import EmergencyHighlightBanner from './components/Header/EmergencyHighlightBanner';
import { Figure } from 'react-bootstrap';
import LogoutIcon from './images/logouticon.svg';

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { searchPosts } from "./actions/newsfeed";
import { getUser } from "./actions/user";
import { createPost, updatePost } from "./actions/posts";
import { logout } from "./actions/auth";

import decode from 'jwt-decode';

const Newsfeed = ({ username, token }) => {
    const [getPosts, setGetPosts] = useState(false);
    const [modalShowProfile, setModalShowProfile] = useState(false);
    const [searchParams, setSearchParams] = useState({ filters: '', page: 1, limit: 3 });
    
    const { posts, prevPage, nextPage } = useSelector((state) => state.newsfeed);

    const user = useSelector((state) => state.user);
    const reported = user?.reportsAgainst?.length > 0;
    
    const dispatch = useDispatch();

    const nullifyToken = () => dispatch(logout());

    useEffect(() => {
        let isComponentMounted = true
		const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))
		const time = decode(token).exp * 1000 - (new Date().getTime())
		console.log(time / 1000)
		delay(time < 0 ? 0 : time)
        .then(() => {
            console.log('time do be up tho')
            if (isComponentMounted) {
                console.log('removal')
                nullifyToken()
            } else {
                console.log('already logged out')
            }
        })
        .catch(error => console.log(error))

        return () => {
            console.log('i am unmount')
            isComponentMounted = false
        }
    }, [])

    useEffect(() => dispatch(getUser(username)), []);

    useEffect(() => dispatch(searchPosts(searchParams)), [searchParams, getPosts]);

    const reloadNewsfeed = () => {
        setSearchParams({ ...searchParams, page: 1, filters: '' });
        setGetPosts(!getPosts); //ensures reloading even on page 1
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    //Fulfill post
    const fulfillPost = (post) => {
        let updates = {};
        if (username == post.username) {
            updates = { fulfilledByPoster: true };
        }
        else {
            updates = { fulfilledByDonor: username };
        }
        dispatch(updatePost(post._id, updates, user))
        .then((flag) => flag && reloadNewsfeed());
    }

    //Create post
    const onAdd = (post) => dispatch(createPost({ ...post, username, date: new Date() }, user)).then(() => reloadNewsfeed());

    const movePage = (page) => {
        setSearchParams({ ...searchParams, page });
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    const rightClick = () => nextPage && movePage(nextPage);

    const leftClick = () => prevPage && movePage(prevPage);

    const setRequestsAmount = (amount) => setSearchParams({ ...searchParams, limit: amount });

    return !reported ? (
        <div style={{ backgroundColor:'gray', height:'1050px'}}>
            <div style={{ backgroundColor:'gray' }}>
                <NavBarGeneric 
                    modalShowProfile={modalShowProfile} setModalShowProfile={setModalShowProfile}
                    searchParams={searchParams} setSearchParams={setSearchParams}
                    onFulfill={(post) => fulfillPost(post)}
                    nullifyToken={() => nullifyToken()}
                />
                <EmergencyHighlightBanner/>
                <div className="container" style={{ backgroundColor:'pink', paddingTop:'100px' }} >
                    <Header onAdd={onAdd} amount={searchParams.limit} setAmount={(amount) => setRequestsAmount(amount)} />
                    {
                        posts.length > 0 ? (
                            <Posts 
                                posts={posts} 
                                onFulfill={(post) => fulfillPost(post)} 
                                setModalShowProfile={setModalShowProfile}
                            />
                        ) : (
                            <h3>No Posts Available</h3>
                        )
                    }
                </div>
                <br/>
                <Pagination style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <Pagination.Prev onClick = {() => leftClick()} />
                    <Pagination.Item disabled>{searchParams.page}</Pagination.Item>
                    <Pagination.Next onClick = {() => rightClick()} />
                </Pagination>
                <br/>
            </div>
        </div>
    ) : (<div>
            <h2>You're reported REEEEEE.</h2>
            <Figure style={{ paddingRight:'5px', marginTop:'25px' }}>
                <Figure.Image
                    width={32}
                    height={32}
                    src={LogoutIcon}
                    onClick={() => nullifyToken()}
                />
            </Figure>
        </div>);
}

export default Newsfeed;