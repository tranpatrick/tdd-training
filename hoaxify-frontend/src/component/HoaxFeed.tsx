import React, {Component} from 'react';
import * as apiCalls from '../api/apiCalls'
import Spinner from "./Spinner";
import HoaxView from "./HoaxView";

interface HoaxFeedState {
    page: {
        content: any[],
        last: boolean
    },
    isLoadingHoaxes: boolean
}

class HoaxFeed extends Component<any, any> {

    state = {
        page: {
            content: [],
            last: false
        },
        isLoadingHoaxes: false
    }

    componentDidMount() {
        this.setState({isLoadingHoaxes: true})
        apiCalls.loadHoaxes(this.props.user)
            .then((response: any) => {
                this.setState({
                    page: response.data,
                    isLoadingHoaxes: false
                });
            });
    }

    render() {
        if (this.state.isLoadingHoaxes) {
            return (
                <Spinner/>
            )
        }
        if (this.state.page.content.length === 0) {
            return (
                <div className="card card-header text-center">
                    There are no hoaxes
                </div>
            )
        }

        return (
            <div>
                {
                    this.state.page.content.map((hoax: any) => {
                        return <HoaxView
                            key={hoax.id}
                            hoax={hoax}/>
                    })
                }
                {!this.state.page.last && <div className="card card-header text-center">Load More</div>}
            </div>
        );
    }
}

export default HoaxFeed;