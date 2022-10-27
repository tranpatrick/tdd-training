import React from 'react';
import Input from "../component/Input";
import ButtonWithProgress from "../component/ButtonWithProgress";

interface LoginPageProps {
    actions: any
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
            this.props.actions.postLogin(body)
                .catch((error: any) => {
                    if (error.response) {
                        this.setState({apiError: error.response.data.message})
                    }
                })
                .finally(() => {
                    this.setState({pendingApiCall: false})
                });
        }
    }

    render() {
        let disableSubmit = false;
        if (this.state.username === '' || this.state.password === '') {
            disableSubmit = true;
        }

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
        }
    }

}