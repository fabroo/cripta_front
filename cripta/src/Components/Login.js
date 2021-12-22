import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "fcorzini@gmail.com",
      password: "123456",
      URL: "https://cripta.herokuapp.com/auth/login",
    };
  }
  notify = (msg) =>
    toast(msg, {
      pauseOnHover: false,
      autoClose: 3000,
    });
  handleSubmit = async () => {
    if (this.state.email == "" || this.state.password == "") {
      this.notify("Please fill out all fields");
      return;
    }
    try {
      fetch(this.state.URL, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          authorization:
            "Basic " + btoa(this.state.email + ":" + this.state.password),
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            this.notify(res.message);
            return;
          }
          let { token } = res;
          this.notify(res.message);
          localStorage.setItem("token", token);
          setTimeout(() => {
            window.location.href = "/play";
          }, 500);
        });
    } catch (error) {
      this.notify(error);
    }
  };

  render() {
    return (
      <>
        <Helmet>
          <title>Login</title>
        </Helmet>
        <div className="login">
          <div className="loginContainer">
            <input
              value={this.state.email}
              placeholder="email"
              onChange={(e) => this.setState({ email: e.target.value })}
              type="text"
              className="loginInput email"
            />
            <input
              value={this.state.password}
              placeholder="Password"
              onChange={(e) => this.setState({ password: e.target.value })}
              type="password"
              className="loginInput password"
            />
            <Link to="/register" className="loginRegisterTxt">
              Register Instead
            </Link>
            <button onClick={() => this.handleSubmit()} className="loginBtn">
              Login
            </button>
            <Link className="" to="/play">
              <button className="playBtn">Play anonymously</button>
            </Link>
          </div>
        </div>
        <ToastContainer />
      </>
    );
  }
}
