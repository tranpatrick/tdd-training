import React, {ChangeEvent} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import Input from "../component/Input";


interface UserSignupPageProps {
    actions: any
}

interface SignupErrors {
    username: string,
    displayName: string,
    password: string,
    repeatPassword: string
}

interface SignUpState {
    displayName: string;
    username: string;
    password: string;
    passwordRepeat: string;
    pendingApiCall: boolean;
    passwordRepeatConfirmed: boolean;
    errors?: SignupErrors
}

export class UserSignupPage extends React.Component<UserSignupPageProps, any> {

    state: SignUpState = {
        displayName: '',
        username: '',
        password: '',
        passwordRepeat: '',
        pendingApiCall: false,
        passwordRepeatConfirmed: true
    }


    onChangeDisplayName = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const errors = {...this.state.errors};
        delete errors.displayName;
        this.setState({displayName: value, errors});
    }

    onChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const errors = {...this.state.errors};
        delete errors.username;
        this.setState({username: value, errors})
    }

    onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const passwordRepeatConfirmed = this.state.passwordRepeat == value
        const errors = {...this.state.errors};
        errors.repeatPassword = passwordRepeatConfirmed ? '' : 'Does not match to password';
        delete errors.password;
        this.setState({password: value, passwordRepeatConfirmed, errors})
    }

    onChangePasswordRepeat = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const passwordRepeatConfirmed = this.state.password == value
        const errors = {...this.state.errors};
        errors.repeatPassword = passwordRepeatConfirmed ? '' : 'Does not match to password';
        this.setState({passwordRepeat: value, passwordRepeatConfirmed, errors})
    }

    onClickSignup = () => {
        const user = {
            username: this.state.username,
            displayName: this.state.displayName,
            password: this.state.password,
        }
        this.setState({pendingApiCall: true})
        this.props.actions.postSignup(user)
            .then(() => {
                this.setState({pendingApiCall: false});
            })
            .catch((apiError: any) => {
                let errors = {...this.state.errors}
                if (apiError.response.data && apiError.response.data.validationErrors) {
                    errors = {...apiError.response.data.validationErrors}
                }
                this.setState({pendingApiCall: false, errors});
            })
    }

    render() {
        return (
            <div className="container">
                <h1 className="text-center">Sign Up</h1>
                <div className="col-12 mb-3">
                    <Input label="Display name"
                           className="form-control"
                           placeholder="Your display name"
                           value={this.state.displayName}
                           onChange={this.onChangeDisplayName}
                           hasError={this.state.errors?.displayName && true}
                           error={this.state.errors?.displayName}
                    />
                </div>
                <div className="col-12 mb-3">
                    <Input label="Username"
                           placeholder="Your username"
                           value={this.state.username}
                           onChange={this.onChangeUsername}
                           hasError={this.state.errors?.username && true}
                           error={this.state.errors?.username}
                    />
                </div>
                <div className="col-12 mb-3">
                    <Input label="Password"
                           type="password"
                           placeholder="Your password"
                           value={this.state.password}
                           onChange={this.onChangePassword}
                           hasError={this.state.errors?.password && true}
                           error={this.state.errors?.password}
                    />
                </div>
                <div className="col-12 mb-3">
                    <Input label="Repeat password"
                           type="password"
                           placeholder="Repeat your password"
                           value={this.state.passwordRepeat}
                           onChange={this.onChangePasswordRepeat}
                           hasError={this.state.errors?.repeatPassword && true}
                           error={this.state.errors?.repeatPassword}
                    />
                </div>
                <div className="text-center">
                    <button className="btn btn-primary"
                            onClick={this.onClickSignup}
                            disabled={this.state.pendingApiCall || !this.state.passwordRepeatConfirmed}>
                        {this.state.pendingApiCall && (
                            <div className="spinner-border text-light spinner-border-sm mr-1">
                                <span data-testid="spinner" className="sr-only"></span>
                            </div>
                        )}
                        Sign Up
                    </button>
                </div>
            </div>
        );
    }

    static defaultProps = {
        actions: {
            postSignup: () => new Promise((resolve, reject) => {
                resolve({})
            })
        }
    }
}

export default UserSignupPage;