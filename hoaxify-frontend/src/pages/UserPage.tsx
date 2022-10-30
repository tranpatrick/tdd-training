import React from "react";
import * as apiCalls from '../api/apiCalls'
import ProfileCard from "../component/ProfileCard";

interface UserPageProps {
    match: any;
}

interface UserPageState {
    user?: {
        displayName: string,
        username: string
    },
    isLoadingUser: boolean,
    userNotFound?: boolean
}

class UserPage extends React.Component<UserPageProps, any> {

    state: UserPageState = {
        user: undefined,
        isLoadingUser: false
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

    render() {
        let pageContent;

        if (this.state.isLoadingUser) {
            pageContent = (
                <div className="d-flex">
                    <div className="spinner-border text-black-50">
                        <span data-testid="spinner" className="sr-only">Loading...</span>
                    </div>
                </div>
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
            pageContent = (
                this.state.user && <ProfileCard user={this.state.user}/>
            );
        }

        return <div data-testid="userpage">{pageContent}</div>
    }

    static defaultProps = {
        match: {
            params: {}
        }
    }
}


export default UserPage;