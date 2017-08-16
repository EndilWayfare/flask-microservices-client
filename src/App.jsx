import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';

import About from './About';
import AddUser from './components/AddUser';
import Form from './components/Form';
import NavBar from './components/NavBar';
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
            }
        }

        this.addUser = this.addUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUserFormChange = this.handleUserFormChange.bind(this);
        this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this);
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
            console.log(res.data);
        })
        .catch((err) => { console.log(err); });
    }

    render() {
        return (
            <div>
                <NavBar title={this.state.title} />
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <br/>
                            <Switch>
                                <Route exact path='/' render={() => (
                                    <div>
                                        <h1>All Users</h1>
                                        <hr/><br/>
                                        <AddUser
                                            username={this.state.username}
                                            email={this.state.email}
                                            addUser={this.addUser}
                                            handleChange={this.handleChange}
                                        />
                                        <br />
                                        <UsersList users={ this.state.users } />
                                    </div>
                                )} />
                                <Route exact path='/about' component={About} />
                                <Route exact path='/register' render={() => (
                                    <Form
                                        formType={'Register'}
                                        formData={this.state.formData}
                                        handleFormChange={this.handleUserFormChange}
                                        handleFormSubmit={this.handleUserFormSubmit}
                                    />
                                )} />
                                <Route exact path='/login' render={() => (
                                    <Form
                                        formType={'Login'}
                                        formData={this.state.formData}
                                        handleFormChange={this.handleUserFormChange}
                                        handleFormSubmit={this.handleUserFormSubmit}
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