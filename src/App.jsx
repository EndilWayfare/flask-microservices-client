import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';

import About from './About';
import Form from './components/Form';
import Logout from './components/Logout';
import NavBar from './components/NavBar';
import UserStatus from './components/UserStatus';
import UsersList from './components/UsersList';


class App extends Component {
    constructor() {
        super();
        this.state = {
            users: [],
            username: '',
            email: '',
            title: 'TestDriven.io',
            formData: {
                username: '',
                email: '',
                password: ''
            },
            isAuthenticated: false
        }

        this.addUser = this.addUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUserFormChange = this.handleUserFormChange.bind(this);
        this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this);
        this.logoutUser = this.logoutUser.bind(this);
    }

    componentDidMount() {
        this.getUsers();
    }

    getUsers() {
        axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
        .then((res) => { this.setState({ users: res.data.data.users }); })
        .catch((err) => { console.log(err); })
    }

    addUser(event) {
        event.preventDefault();
        const data = {
            username: this.state.username,
            email: this.state.email
        }
        axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`, data)
        .then((res) => {
            this.getUsers();
            this.setState({ username: '', email: '' });
        })
        .catch((err) => {console.log(err); })
    }

    handleChange(event) {
        const obj = {};
        obj[event.target.name] = event.target.value;
        this.setState(obj);
    }

    handleUserFormChange(event) {
        // 'event' argument is a React SyntheticEvent, so it will be invalidated
        // when this handler function exits. setState is called asynchronously,
        // so 'event' will already be reclaimed. Cache the target name and value
        // for later use.
        const targetName = event.target.name;
        const targetValue = event.target.value;
        this.setState(
            (prevState, props) => {
                const obj = {formData: {...prevState.formData}};
                obj.formData[targetName] = targetValue;
                return obj;
            });
    }

    handleUserFormSubmit(event) {
        event.preventDefault();
        const formType = window.location.href.split('/').pop();
        let data;
        if (formType === 'login') {
            data = {
                email: this.state.formData.email,
                password: this.state.formData.password
            }
        }
        else if (formType === 'register') {
            data = {
                username: this.state.formData.username,
                email: this.state.formData.email,
                password: this.state.formData.password
            }
        }

        const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/${formType}`
        axios.post(url, data)
        .then((res) => {
            window.localStorage.setItem('authToken', res.data.auth_token);
            this.setState({
                formData: {username: '', email: '', password: ''},
                isAuthenticated: true
            });
            this.getUsers();
        })
        .catch((err) => { console.log(err); });
    }

    logoutUser() {
        window.localStorage.clear();
        this.setState({ isAuthenticated: false });
    }

    render() {
        return (
            <div>
                <NavBar
                    title={this.state.title}
                    isAuthenticated={this.state.isAuthenticated}
                />
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <br/>
                            <Switch>
                                <Route exact path='/' render={() => (
                                    <div>
                                        <UsersList users={ this.state.users } />
                                    </div>
                                )} />
                                <Route exact path='/about' component={About} />
                                <Route exact path='/status' render={() => (
                                    <UserStatus
                                        isAuthenticated={this.state.isAuthenticated}
                                    />
                                )} />
                                <Route exact path='/register' render={() => (
                                    <Form
                                        formType={'Register'}
                                        formData={this.state.formData}
                                        handleFormChange={this.handleUserFormChange}
                                        handleFormSubmit={this.handleUserFormSubmit}
                                        isAuthenticated={this.state.isAuthenticated}
                                    />
                                )} />
                                <Route exact path='/login' render={() => (
                                    <Form
                                        formType={'Login'}
                                        formData={this.state.formData}
                                        handleFormChange={this.handleUserFormChange}
                                        handleFormSubmit={this.handleUserFormSubmit}
                                        isAuthenticated={this.state.isAuthenticated}
                                    />
                                )}/>
                                <Route exact path='/logout' render={() => (
                                    <Logout
                                        logoutUser={this.logoutUser}
                                        isAuthenticated={this.state.isAuthenticated}
                                    />
                                )}/>
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;