import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactTooltip from "react-tooltip";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineQueryStats } from "react-icons/md";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { ReactComponent as Loader } from "../Assets/Gifs/Loader.svg";

export default class Podium extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem("token"),
      URL: "https://cripta.herokuapp.com/stats",
      top5: null,
    };
  }
  componentDidMount() {
    fetch(this.state.URL + "/topAmount", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.error) {
          this.setState({
            top5: res.data,
          });
        }
      });
  }
  render() {
    return (
      <>
        <Helmet>
          <title>Dashboard</title>
        </Helmet>
        <div className="topContainer topContainerDashboard">
          <div
            data-tip="Home"
            className="toggleBtn"
            onClick={() => {
              window.location.href = "/play";
            }}
          >
            <AiOutlineHome className="infoIcon" color="#7D84B2" size={32} />
          </div>
          <div
            data-tip="Stats"
            className="toggleBtn"
            onClick={() => {
              window.location.href = "/stats";
            }}
          >
            <MdOutlineQueryStats
              className="infoIcon"
              color="#7D84B2"
              size={32}
            />
          </div>
          <div
            data-tip={this.state.token ? "Logout" : "Login"}
            className="toggleBtn"
            onClick={() => {
              if (this.state.token) {
                this.setState({
                  token: null,
                  user: {},
                });
                localStorage.removeItem("token");
                window.location.href = "/login";
              } else {
                window.location.href = "/login";
              }
            }}
          >
            {!this.state.token ? (
              <BiLogIn className="infoIcon" color="#7D84B2" size={32} />
            ) : (
              <BiLogOut className="infoIcon" color="#7D84B2" size={32} />
            )}
          </div>
        </div>
        <div className="app">
            <div className="podiumContainer">
            <p className="podiumTitle">Podio</p>
            <div className="top5Container">
              {!this.state.top5 ? (
                <Loader width={150} />
              ) : (
                this.state.top5.map((item, index) => {
                  return (
                    <div className="top5Item" key={index}>
                      <p className="top5ItemNumber">{index + 1}</p>
                      <p className="top5ItemName">{item.username}</p>
                      <p className="top5ItemAmount">{item.amountWon}</p>
                    </div>
                  );
                })
              )}
            </div>
            </div>
        </div>
        <ReactTooltip place="left" type="dark" effect="solid" />
      </>
    );
  }
}
