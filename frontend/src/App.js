import './index.css';
import Home from './Home';
import Newsfeed from './Newsfeed';

import decode from 'jwt-decode';

import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default () => {
    const token = useSelector((state) => state.auth.token);
	
	return (
		<div>
			{
				!token ? (<Home/>)
				: (<Newsfeed username={decode(token).username} token={token}/>)
			}
		</div>
	)
}