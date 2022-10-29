import * as apiCalls from '../api/apiCalls'

export const loginSuccess = (loginUserData: any) => {
    return {
        type: 'login-success',
        payload: loginUserData
    }
}

export const loginHandler = (credentials: any) => {
    console.log('loginHandler')
    return function (dispatch: any) {
        return apiCalls.login(credentials).then(response => {
            dispatch(
                loginSuccess({
                    ...response.data,
                    password: credentials.password
                })
            );
            return response;
        })
    }
}

export const signupHandler = (user: any) => {
    return function (dispatch: any) {
        return apiCalls.signup(user).then((response) => {
            return dispatch(loginHandler(user));
        })
    }
}