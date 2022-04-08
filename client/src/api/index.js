import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    //baseURL: 'http://localhost:4000/api' //LOCAL BUILD
    baseURL: 'https://derit.herokuapp.com/api'

})
export const getLoggedIn = () => api.get(`/loggedIn/`);
export const registerUser = (payload) => api.post(`/register/`, payload)
export const loginUser = (payload) => api.post(`/user/`, payload)
export const logoutUser = () => api.get(`/logout/`)
export const getUserByUsername = (username) => api.get(`/user/${username}`)
export const getUserSecurityQuestion = (email) => api.get(`/user/email/${email}`)
export const resetPassword = (payload) => api.put(`/resetPassword/`, payload)

const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser, 
    getUserByUsername,
    getUserSecurityQuestion,
    resetPassword
}

export default apis
