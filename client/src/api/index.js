import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api' //LOCAL BUILD
    //baseURL: 'https://derit.herokuapp.com/api', HEROKU DEPLOYMENT 

})
export const getLoggedIn = () => api.get(`/loggedIn/`);
export const registerUser = (payload) => api.post(`/register/`, payload)
export const loginUser = (payload) => api.post(`/user/`, payload)
export const logoutUser = () => api.get(`/logout/`)
export const getUserByUsername = (username) => api.get(`/user/${username}`)
export const getUserByEmail = (email) => api.get(`/user/email/${email}`)

const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser, 
    getUserByUsername,
    getUserByEmail
}

export default apis
