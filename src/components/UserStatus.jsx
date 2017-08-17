import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


class UserStatus extends Component {
    constructor (props) {
        super(props)
        this.state = this.initialState()
        console.log(this.state);
    }

    initialState() {
        return {
            created_at: '',
            email: '',
            id: '',
            username: ''
        }
    }

    componentDidMount() {
        this.getUserStatus();
    }

    getUserStatus() {
        if (this.props.isAuthenticated) {
            const options = {
            url: `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/status`,
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${window.localStorage.authToken}`
            }
            };
            return axios(options)
            .then((res) => {
                const status = res.data.data;
                this.setState({
                    username: status.created_at,
                    email: status.email,
                    id: status.id,
                    created_at: status.created_at
                })
            })
            .catch((error) => { console.log(error); })
        }
        else {
            this.setState(this.initialState);
        }
    }

    render() {
        if (!this.props.isAuthenticated) {
            return <p>You must be logged in to view this. Click <Link to='/login'>here</Link> to log in.</p>
        }
        return (
            <div>
                <ul>
                    <li><strong>User ID:</strong> {this.state.id}</li>
                    <li><strong>Email:</strong> {this.state.email}</li>
                    <li><strong>Username:</strong> {this.state.username}</li>
                </ul>
            </div>
        )
    }
}

Object.freeze(UserStatus.initialState);

export default UserStatus