import React, { Component } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ReactComponent as Loader } from "../Assets/Gifs/Loader.svg";
import ReactTooltip from 'react-tooltip'
import jwt from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GiPodium } from "react-icons/gi";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { AiOutlineHome } from "react-icons/ai";
import axios from "axios";
import { Helmet } from "react-helmet";

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      data: null,
      count: null,
      URL: "https://cripta.herokuapp.com",
      user: {},
      loading: true,
      token: localStorage.getItem("token"),
    };
  }
  notify = (msg) =>
    toast(msg, {
      pauseOnHover: false,
      autoClose: 3000,
    });

  async componentDidMount() {
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
    }
    let userReq = await axios.get(this.state.URL + "/user/me", {
      headers: { authorization: "Basic " + localStorage.getItem("token") },
    });
    if (!userReq.data.error) {
      this.setState({
        user: jwt(userReq.data.data).user,
      });
    } else {
      this.notify("Aca hubo engaña pichanga");
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }

    let count = await axios.get(this.state.URL + "/stats/getCount");
    if (!count.data.error) {
      this.setState({
        count: count.data.count,
      });
    } else {
      console.log("ERROR: " + count.data.error);
    }

    let timeGroups = await axios.get(
      this.state.URL + "/stats/overTime?numberDocs=1000"
    );
    if (!timeGroups.data.error) {
      let { data } = timeGroups.data;
      let dataArray = [];

      console.log(timeGroups.data);
      for (let group of Object.entries(data)) {
        dataArray.push({ name: group[0], won: group[1] });
      }
      this.setState({
        data: dataArray,
        loading: false,
      });
    } else {
      console.log("ERROR: " + count.data.error);
    }
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
            <AiOutlineHome
              className="infoIcon"
              color="#7D84B2"
              size={32}
            />
          </div>
          <div
            data-tip="Podio"
            className="toggleBtn"
            onClick={() => {
              window.location.href = "/podio";
            }}
          >
            <GiPodium
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
          <div className="dashboardContainer">
           {this.state.loading ? (<Loader width={150} />): (
             <>
              <div className="leftSide">
              
                <div className="cardInfo">
                  <p className="infoTitle">@{this.state.user.username}</p>
                  <p className="infoCount infoCountHeader">Email: </p>
                  <p className="infoCount infoCountValue">{this.state.user.email}</p>
                  <p className="infoCount infoCountHeader">Average Time:</p>
                  <p className="infoCount infoCountValue">{this.state.user.averageTime ? this.state.user.averageTime+"''"  :null}</p>
                  <p className="infoCount infoCountHeader">Amount Won: </p>
                  <p className="infoCount infoCountValue">{this.state.user.amountWon}</p>
                </div>
            </div>
            <div className="rightSide">
             
                <div className="graph">
                  {this.state.data && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        width={500}
                        height={400}
                        cx="50%"
                        data={this.state.data}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="won"
                          stroke="#6188c4"
                          fill="#99b2d9"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              
            </div>
            </>
           )}
          </div>
        </div>
        <ReactTooltip place="left" type="dark" effect="solid" />
      </>
    );
  }
}
