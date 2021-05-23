import React, { Fragment } from 'react';

class LoginAdmin extends React.Component {
    
    constructor() {
        super();
        this.state = {
            username: "",
            password: "",
            logged: false,
            onLoginMessage: ""
        };

        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    //this is for listening to changes for multiple input elements.
    handleChange(event) {
        const value = event.target.value;
        this.setState({
            ...this.state,
            [event.target.name]: value
        });
    }

    async login() {
        const response = await (await fetch(`
        http://localhost:3000/loginAdmin?username=${this.state.username}&password=${this.state.password}
        `,{
            method: 'GET',
            credentials: 'include'
          })).json();

        if (response.message === "Admin is logged in." || response.message === "Admin is already logged in.") {
            this.setState({logged: true});
        } else {
            this.setState({onLoginMessage: response.message});
        }    
    }

    render() {

        if (this.state.logged === true) {
            return(
                <Fragment>
                    <h1>Dashboard</h1>
                    <p>Add or remove comics or chapters</p>
                </Fragment>
            );    
        }

        return (
            <Fragment>
                <h1> Login as an admin </h1>
                <div>
                    Username : <input type="text" value={this.state.username} onChange={this.handleChange} name="username"/>
                    <br/>
                    Password : <input type="text" value={this.state.password} onChange={this.handleChange} name="password"/>
                </div>
                <br/>
                <button onClick={this.login}>Login</button>
                <br/>
                <p>{this.state.onLoginMessage}</p>
            </Fragment>
        );
          
    }
}

export default LoginAdmin;