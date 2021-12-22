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
import jwt from 'jwt-decode'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
  
import axios from "axios";
import { Helmet } from "react-helmet";

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      data: null,
      count: null,
      URL: "https://cripta.herokuapp.com",
      user: {}
    };
  }
  notify = (msg) =>
    toast(msg, {
      autoClose: 3000,
    });


  async componentDidMount() {
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
    }
    let userReq = await axios.get(this.state.URL + "/user/me", {headers: {authorization: "Basic "+localStorage.getItem("token")}});
    if(!userReq.data.error){
      this.setState({
        user: jwt(userReq.data.data).user,
      })
    }
    else{
      this.notify("Aca hubo engaña pichanga")
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
        dataArray.push({ name: group[0], count: group[1] });
      }
      this.setState({
        data: dataArray,
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

        <div className="app">
          <div className="dashboardContainer">
            <div className="leftSide">
              <div className="cardInfo">
                <p className="infoTitle">Count:</p>
                <p className="infoCount">{this.state.count}</p>
                <p className="infoCount">Name: {this.state.user.name}</p>
                <p className="infoCount">Email: {this.state.user.email}</p>
                <p className="infoCount">Average Time: {this.state.user.averageTime}</p>
                <p className="infoCount">Amount Won: {this.state.user.amountWon}</p>
              </div>
            </div>
            <div className="divider"></div>
            <div className="rightSide">
              <div className="graph">
                {this.state.data && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      width={500}
                      height={400}
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
                        dataKey="count"
                        stroke="#8884d8"
                        fill="#8884d8"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
