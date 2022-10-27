import axios from "axios";

export const signup = (user: any) => {
    return axios.post('/api/v1.0/users', user)
}

export const login = (user: any) => {
    return axios.post('/api/v1.0/login', {}, {auth: user})
}