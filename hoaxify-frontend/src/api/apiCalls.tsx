import axios from "axios";
import { Buffer } from 'buffer';

export const signup = (user: any) => {
    return axios.post('/api/v1.0/users', user)
}

export const login = (user: any) => {
    return axios.post('/api/v1.0/login', {}, {auth: user})
}

interface AuthState {
    username: string,
    password: string,
    isLoggedIn: boolean
}

export const setAuthorizationHeader = (state: AuthState) => {
    if (state.isLoggedIn) {
        axios.defaults.headers.common['Authorization'] = `Basic ${Buffer.from(
            state.username + ':' + state.password
        ).toString('base64')}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};