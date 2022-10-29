import React from 'react';
import Input from '../component/Input';
import ButtonWithProgress from '../component/ButtonWithProgress';
import {connect} from 'react-redux';
import * as authActions from '../redux/authActions'

interface LoginPageProps {
    actions: any
    history?: any
    dispatch?: any
}

export class LoginPage extends React.Component<LoginPageProps, any> {

    state = {
        username: '',
        password: '',
        apiError: '',
        pendingApiCall: false
    }

    onChangeUsername = (event: any) => {
        const value = event.target.value;
        this.setState({
            username: value,
            apiError: undefined
        })
    }

    onChangePassword = (event: any) => {
        const value = event.target.value;
        this.setState({
            password: value,
            apiError: undefined
        })
    }

    onClickLogin = () => {
        const body = {
            username: this.state.username,
            password: this.state.password
        }
        if (!this.state.pendingApiCall) {
            this.setState({pendingApiCall: true});
            this.props.actions
                .postLogin(body)
                .then(() => {
                    this.setState({pendingApiCall: false}, () => {
                        this.props.history.push('/');
                    })
                })
                .catch((error: any) => {
                    if (error.response) {
                        this.setState({
                            pendingApiCall: false,
                            apiError: error.response.data.message
                        })
                    }
                })
        }
    }

    render() {
        const disableSubmit = this.state.username === '' || this.state.password === '';

        return (
            <div className="container">
                <h1 className="text-center">Login</h1>
                <div className="col-12 mb-3">
                    <Input
                        label="Username"
                        placeholder="Your username"
                        value={this.state.username}
                        onChange={this.onChangeUsername}
                        // onChange={(event) => {
                        //     setUsername(event.target.value);
                        // }}
                    />
                </div>
                <div className="col-12 mb-3">
                    <Input
                        label="Password"
                        placeholder="Your password"
                        type="password"
                        value={this.state.password}
                        onChange={this.onChangePassword}
                        // onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                {this.state.apiError && (
                    <div className="col-12 mb-3">
                        <div className="alert alert-danger">{this.state.apiError}</div>
                    </div>
                )}
                <div className="text-center">
                    <ButtonWithProgress
                        onClick={this.onClickLogin}
                        disabled={disableSubmit || this.state.pendingApiCall}
                        text="Login"
                        pendingApiCall={this.state.pendingApiCall}
                    />
                </div>
            </div>

        )
    }

    static defaultProps = {
        actions: {
            postLogin: () => new Promise((resolve, reject) => {
                resolve({})
            })
        },
        history: {
            push: () => {}
        }
    }

}

const mapDispatchToProps = (dispatch: any) => {
    return {
        actions: {
            postLogin: (body: any) => dispatch(authActions.loginHandler(body))
        }
    }
}

export default connect(null, mapDispatchToProps)(LoginPage);