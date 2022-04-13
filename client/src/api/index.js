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
export const getUserSecurityQuestion = (email) => api.get(`/user/email/${email}`)
export const resetPassword = (payload) => api.put(`/resetPassword/`, payload)

export const getUser = (username) => api.get(`/user/${username}`);
export const searchGames = (query) => api.get(`/search/${query}`);

export const updateUser = (payload) => api.put('/user/updateInfo', payload);
export const updateFollowers = (payload) => api.put('/user/followers', payload);
export const removeUser = (payload) => api.delete(`/user/delete/${payload.email}/${payload.password}`);

export const changePassword = (payload) => api.put(`/changePassword/`, payload)


const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser, 
    getUserByUsername,
    getUserSecurityQuestion,
    resetPassword,
    getUser,
    searchGames,
    changePassword,
    updateUser,
    updateFollowers,
    removeUser,
    changePassword
}

export default apis
