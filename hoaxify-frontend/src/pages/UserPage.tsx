import React from "react";
import * as apiCalls from '../api/apiCalls'
import ProfileCard from "../component/ProfileCard";
import {connect} from "react-redux";
import HoaxFeed from "../component/HoaxFeed";
import Spinner from "../component/Spinner";

interface UserPageProps {
    match: any;
    loggedInUser?: any;
    dispatch?: any;
}

interface UserPageState {
    user?: {
        displayName: string,
        username: string,
        image: string
    },
    isLoadingUser: boolean,
    inEditMode: boolean,
    pendingUpdateCall: boolean
    userNotFound?: boolean
    originalDisplayName?: string,
    image?: string
    errors?: any
}

class UserPage extends React.Component<UserPageProps, any> {

    state: UserPageState = {
        user: undefined,
        isLoadingUser: false,
        inEditMode: false,
        originalDisplayName: undefined,
        pendingUpdateCall: false,
        image: undefined
    }

    componentDidMount() {
        this.loadUser();
    }

    componentDidUpdate(prevProps: Readonly<UserPageProps>, prevState: Readonly<any>, snapshot?: any) {
        if (prevProps.match.params.username !== this.props.match.params.username) {
            this.setState({userNotFound: false});
            this.loadUser();
        }
    }

    loadUser = () => {
        const username = this.props.match.params.username;
        if (!username) {
            return;
        }
        this.setState({userNotFound: false, isLoadingUser: true})
        apiCalls.getUser(username)
            .then((response: any) => {
                this.setState({user: response.data, isLoadingUser: false})
            })
            .catch((error: any) => {
                this.setState({userNotFound: true, isLoadingUser: false})
            });
    }

    onClickEdit = () => {
        this.setState({inEditMode: true});
    }

    onClickCancel = () => {
        const user = {...this.state.user};
        if (this.state.originalDisplayName !== undefined) {
            user.displayName = this.state.originalDisplayName;
        }
        this.setState({
            user,
            originalDisplayName: undefined,
            inEditMode: false,
            image: undefined,
            errors: {}
        });
    }

    onClickSave = () => {
        const userId = this.props.loggedInUser.id
        const userUpdate = {
            displayName: this.state.user?.displayName,
            image: this.state.image && this.state.image.split(',')[1]
        };
        this.setState({pendingUpdateCall: true});
        apiCalls.updateUser(userId, userUpdate)
            .then((response: any) => {
                const user = {
                    ...this.state.user,
                    image: response.data.image
                }
                this.setState({
                    inEditMode: false,
                    originalDisplayName: undefined,
                    pendingUpdateCall: false,
                    image: undefined,
                    user
                }, () => {
                    const action = {
                        type: 'update-success',
                        payload: user
                    }
                    this.props.dispatch(action);
                });
            })
            .catch((error: any) => {
                let errors = {};
                if (error.response.data.validationErrors) {
                    errors = error.response.data.validationErrors;
                }
                this.setState({pendingUpdateCall: false, errors});
            });
    }

    onChangeDisplayName = (event: any) => {
        const user = {...this.state.user};
        let originalDisplayName = this.state.originalDisplayName;
        if (originalDisplayName === undefined) {
            originalDisplayName = user.displayName;
        }
        user.displayName = event.target.value;
        const errors = {...this.state.errors}
        errors.displayName = undefined
        this.setState({user, originalDisplayName, errors})
    }

    onFileSelect = (event: any) => {
        if (event.target.files.length === 0) {
            return;
        }

        const errors = {...this.state.errors}
        errors.image = undefined

        const file = event.target.files[0];
        let reader = new FileReader();
        reader.onloadend = () => {
            this.setState({
                image: reader.result,
                errors
            })
        }
        reader.readAsDataURL(file);
    }

    render() {
        let pageContent;

        if (this.state.isLoadingUser) {
            pageContent = (
                <Spinner/>
            )
        } else if (this.state.userNotFound) {
            pageContent = (
                <div className="alert alert-danger text-center">
                    <div className="alert-heading">
                        <i className="fas fa-exclamation-triangle fa-3x"/>
                    </div>
                    <h5>User not found</h5>
                </div>
            )
        } else {
            const isEditable = this.props.loggedInUser.username === this.props.match.params.username;
            pageContent = (
                this.state.user && <ProfileCard user={this.state.user}
                                                isEditable={isEditable}
                                                inEditMode={this.state.inEditMode}
                                                onClickEdit={this.onClickEdit}
                                                onClickCancel={this.onClickCancel}
                                                onClickSave={this.onClickSave}
                                                onChangeDisplayName={this.onChangeDisplayName}
                                                pendingUpdateCall={this.state.pendingUpdateCall}
                                                loadedImage={this.state.image}
                                                onFileSelect={this.onFileSelect}
                                                errors={this.state.errors}/>
            );
        }

        return <div data-testid="userpage">
            <div className="row">
                <div className="col">
                    {pageContent}
                </div>
                <div className="col">
                    <HoaxFeed user={this.props.match.params.username}/>
                </div>
            </div>

        </div>
    }

    static defaultProps = {
        match: {
            params: {}
        },
        loggedInUser: {}
    }
}

const mapStateToProps = (state: any) => {
    return {
        loggedInUser: state
    }
}

export default connect(mapStateToProps)(UserPage);