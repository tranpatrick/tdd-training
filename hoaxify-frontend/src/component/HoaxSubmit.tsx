import React, {Component} from 'react';
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import {connect} from "react-redux";
import * as apiCalls from "../api/apiCalls"
import ButtonWithProgress from "./ButtonWithProgress";


interface HoaxSubmitState {
    focused: boolean,
    pendingApiCall: boolean,
    errors: any
    content?: string,
}

class HoaxSubmit extends Component<any, any> {

    state: HoaxSubmitState = {
        focused: false,
        content: undefined,
        pendingApiCall: false,
        errors: {}
    }

    onChangeContent = (event: any) => {
        const value = event.target.value;
        this.setState({
            content: value,
            errors: {}
        });
    }

    onClickHoaxify = () => {
        const body = {
            content: this.state.content
        }
        this.setState({
            pendingApiCall: true
        })
        apiCalls.postHoax(body)
            .then((response: any) => {
                this.setState({
                    focused: false,
                    content: '',
                    pendingApiCall: false
                })
            })
            .catch((error: any) => {
                let errors = {}
                if (error.response.data && error.response.data.validationErrors) {
                    errors = error.response.data.validationErrors;
                }
                this.setState({
                    errors,
                    pendingApiCall: false
                })
            })
    }

    onFocus = () => {
        this.setState({
            focused: true
        })
    }

    onClickCancel = () => {
        this.setState({
            focused: false,
            content: '',
            errors: {}
        })
    }

    render() {
        let textAreaClassName = 'form-control w-100';
        if (this.state.errors.content) {
            textAreaClassName += ' is-invalid';
        }

        return (
            <div className="card d-flex flex-row p-1">
                <ProfileImageWithDefault
                    className="rounded-circle"
                    width="32"
                    height="32"
                    image={this.props.loggedInUser.image}
                />
                <div className="flex-fill">
                    <textarea
                        className={textAreaClassName}
                        rows={this.state.focused ? 3 : 1}
                        onFocus={this.onFocus}
                        value={this.state.content}
                        onChange={this.onChangeContent}
                    />
                    {this.state.errors.content && (
                        <span className="invalid-feedback">
                            {this.state.errors.content}
                        </span>
                    )}
                    {this.state.focused && (
                        <div className="text-right mt-1">
                            <ButtonWithProgress
                                className="btn btn-success"
                                onClick={this.onClickHoaxify}
                                disabled={this.state.pendingApiCall}
                                pendingApiCall={this.state.pendingApiCall}
                                text="Hoaxify"
                            />
                            <button
                                className="btn btn-light ml-1"
                                onClick={this.onClickCancel}
                                disabled={this.state.pendingApiCall}
                            >
                                <i className="fas fa-times"/>
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state: any) => {
    return {
        loggedInUser: state
    }
}

export default connect(mapStateToProps)(HoaxSubmit);