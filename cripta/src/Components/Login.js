import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
    };
  }
  render() {
    return (
      <>
        <Helmet>
          <title>Login</title>
        </Helmet>
        <div className="login">
          <div className="loginContainer">
            <input
              value={this.state.username}
              placeholder="Username"
              onChange={(e) => this.setState({ username: e.target.value })}
              type="text"
              className="loginInput username"
            />
            <input
              value={this.state.password}
              placeholder="Password"
              onChange={(e) => this.setState({ password: e.target.value })}
              type="password"
              className="loginInput password"
            />
            <p className="loginRegisterTxt">Register Instead</p>
            <button className="loginBtn">Login</button>
            <Link className="" to="/play">
              <button className="playBtn">Play anonymously</button>
            </Link>
          </div>
        </div>
      </>
    );
  }
}
