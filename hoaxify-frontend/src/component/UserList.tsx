import React from "react";
import {connect} from "react-redux";
import * as apiCalls from '../api/apiCalls'
import UserListItem from "./UserListItem";

interface UserListProps {

}

interface UserListState {
    page: {
        content: any[],
        number: number,
        size: number,
        first?: boolean,
        last?: boolean
    },
    loadError?: any
}

export class UserList extends React.Component<UserListProps, UserListState> {

    state: UserListState = {
        page: {
            content: [],
            number: 0,
            size: 3,
        }
    }

    loadData = (requestedPage = 0) => {
        apiCalls.listUsers({page: requestedPage, size: this.state.page.size})
            .then((response: any) => {
                this.setState({
                    page: response.data,
                    loadError: undefined
                })
            })
            .catch((error: any) => {
                this.setState({ loadError: 'User load failed' });
            });
    }

    componentDidMount() {
        this.loadData();
    }

    onClickNext = () => {
        this.loadData(this.state.page.number + 1);
    }

    onClickPrevious = () => {
        this.loadData(this.state.page.number - 1);
    }

    render() {
        return (
            <div className="card">
                <h3 className="card-title m-auto">Users</h3>
                <div className="list-group list-group-flush" data-testid="usergroup">
                    {this.state.page?.content.map((user: any) => {
                        return <UserListItem key={user.username} user={user}/>
                    })}
                </div>
                <div className="clearfix">
                    {!this.state.page?.first && (
                        <span className="badge badge-light" style={{cursor: 'pointer', color: 'black'}}
                        onClick={this.onClickPrevious}>{"<"} previous</span>
                    )}
                    {!this.state.page?.last && (
                        <span className="badge badge-light float-right" style={{cursor: 'pointer', color: 'black'}}
                              onClick={this.onClickNext}>next {">"}</span>
                    )}
                </div>
                {this.state.loadError && <span className="text-center text-danger">{this.state.loadError}</span>}
            </div>
        );
    }
}

export default connect()(UserList);