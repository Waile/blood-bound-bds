import axios from 'axios';

const url = 'http://localhost:5000';
// const url = 'https://blood-bound-bds.herokuapp.com';

const API = axios.create({ baseURL: url });

API.interceptors.request.use((req) => {
    if (localStorage.getItem('jwt')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('jwt')).token}`;
    }

    return req;
});

const loginSignUpUrl = '/loginSignUp';
const verifyUrl = '/verify';
const postUrl = '/posts';
const reportUrl = '/reports';
const emergencyUrl = '/emergency';
const userUrl = '/users';
const chatUrl = '/chats';
const mapUrl = '/map';
const notificationsUrl = '/notify';

const header = { headers: { 'content-type': 'application/json' } };

export const getPosts = () => API.get(postUrl);
export const updatePost = (id, updatedPost) => API.patch(postUrl + `/${id}`, updatedPost);
export const createPost = (newPost) => API.post(postUrl, newPost, header);
export const searchPosts = (searchQuery, page, limit) => API.post(postUrl + '/search' + `?page=${page || 1}&limit=${limit || 10}`, searchQuery, header);
export const getPostsById = (ids) => API.post(postUrl + `/postsById`, ids, header);

export const getEmergencyPosts = () => API.get(emergencyUrl);
export const createEmergencyPost = (newEPost) => API.post(emergencyUrl, newEPost);
export const updateEmergencyPost = (id, updatedEPost) => API.patch(emergencyUrl + `/${id}`, updatedEPost);

export const getReports = () => API.get(reportUrl);
export const createReport = (newReport) => API.post(reportUrl, newReport);
export const updateReport = (id, updatedReport) => API.patch(reportUrl + `/${id}`, updatedReport, header)

export const getUser = (username) => API.get(userUrl + `?username=${username}`); //search by username
export const searchUsers = (searchQuery) => API.post(userUrl + '/search', searchQuery, header);
export const getUsersById = (ids) => API.post(userUrl + '/usersById', ids, header);
export const createUser = (newUser) => API.post(userUrl, newUser);
export const updateUser = (id, updates) => API.patch(userUrl + `/${id}`, updates, header);
export const setForDelete = (id) => API.patch(userUrl + `/delete/${id}`);
export const deleteUser = (id) => API.delete(userUrl + `/${id}`);
export const getSupport = () => API.get(userUrl + `/support`);

export const login = (loginData) => API.post(loginSignUpUrl + '/login', loginData, header);
export const signUp = (user) => API.post(loginSignUpUrl + '/signUp', user, header);
export const assistiveSignUp = (user) => API.post(loginSignUpUrl + '/assistiveSignUp', user, header);
export const forgot = (details) => API.post(loginSignUpUrl + '/forgot', details, header);

export const verifyCode = (id, code) => API.post(verifyUrl + `/verifyCode/${id}`, code, header);
export const resendCode = (id, option) => API.post(verifyUrl + `/resendCode/${id}`, option, header);

export const createChat = (chat, message) => API.post(chatUrl, { chat, message }, header);
export const updateChat = (id, updates) => API.patch(chatUrl + `/${id}`, updates, header);
export const addMessage = (id, message) => API.post(chatUrl + `/${id}`, { message }, header);
export const getChatsById = (ids) => API.post(chatUrl + `/chatsById`, ids, header);
export const getMessagesById = (ids) => API.post(chatUrl + `/messagesById`, ids, header);
export const getChat = (filters) => API.post(chatUrl + '/search', filters, header);

export const getNearbyDonors = (details) => API.post(mapUrl + '/donors', details, header);
export const getNearbyRequests = (details) => API.post(mapUrl + '/requests', details, header);

export const getNotificationsById = (ids) => API.post(notificationsUrl + '/notifsById', ids, header);
export const notify = (details) => API.post(notificationsUrl + '/notify', details, header);
export const markAsRead = (ids) => API.post(notificationsUrl + '/markAsRead', ids, header);