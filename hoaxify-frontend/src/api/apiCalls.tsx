import axios from "axios";
import {Buffer} from 'buffer';


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

export const listUsers = (param: { page?: number, size?: number } = {page: 0, size: 3}): any => {
    const path = `/api/v1.0/users?page=${param.page || 0}&size=${param.size || 3}`
    return axios.get(path)
}

export const getUser = (username: string): any => {
    return axios.get(`/api/v1.0/users/${username}`);
}

export const updateUser = (userId: number, body?: any): any => {
    return axios.put(`/api/v1.0/users/${userId}`, body);
}

export const postHoax = (hoax?: any): any => {
    return axios.post('/api/v1.0/hoaxes', hoax)
}

export const loadHoaxes = (username?: string): Promise<any> => {
    const basePath = username ? `/api/v1.0/users/${username}/hoaxes` : '/api/v1.0/hoaxes';
    return axios.get(basePath + '?page=0&size=5&sort=id,desc');
}
