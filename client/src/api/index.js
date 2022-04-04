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

const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser
}

export default apis
