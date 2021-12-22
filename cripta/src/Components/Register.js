import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class Register extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      email: "",
      password: "",
      passwordCheck: "",
      URL: "https://cripta.herokuapp.com/auth/register",
    };
  }
  notify = (msg) =>
    toast(msg, {
      pauseOnHover: false,
      autoClose: 3000,
    });

  handleSubmit = async () => {
    if (
      this.state.password !== this.state.passwordCheck ||
      this.state.password == "" ||
      this.state.passwordCheck == "" ||
      this.state.username == "" ||
      this.state.email == ""
    ) {
      this.notify("Please fill out all fields");
      return;
    }
    try {
      fetch(this.state.URL, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: this.state.username,
          password: String(this.state.password),
          email: this.state.email,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            this.notify(res.message);
            return;
          }
          let { token } = res;
          this.notify(res.message);
        });
    } catch (error) {
      alert(error);
    }
  };

  render() {
    return (
      <>
        <Helmet>
          <title>Register</title>
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
              value={this.state.email}
              placeholder="Email"
              onChange={(e) => this.setState({ email: e.target.value })}
              type="email"
              className="loginInput username"
            />
            <input
              value={this.state.password}
              placeholder="Password"
              onChange={(e) => this.setState({ password: e.target.value })}
              type="password"
              className="loginInput password"
            />
            <input
              value={this.state.passwordCheck}
              placeholder="Check password"
              onChange={(e) => this.setState({ passwordCheck: e.target.value })}
              type="password"
              className="loginInput password"
            />
            <Link to="/login" className="loginRegisterTxt">
              Login Instead
            </Link>
            <button onClick={() => this.handleSubmit()} className="loginBtn">
              Register
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
