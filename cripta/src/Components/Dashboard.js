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

import axios from "axios";
import { Helmet } from "react-helmet";

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      data: null,
      count: 145,
      URL: "https://cripta.herokuapp.com",
    };
  }
  async componentDidMount() {
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
