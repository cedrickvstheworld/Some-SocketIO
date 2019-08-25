import React, { Component } from "react";
import axios from "axios";
import io from "socket.io-client";

// components
import ChatArea from "./chat_area";
import FriendRequests from './friend_requests';

class Main extends Component {
  constructor() {
    super();
    this.state = {
      isAuthenticated: false,
      user: {},
      friend_request_id: ""
    };
    this.signOut = this.signOut.bind(this);
    this.changeFieldValue = this.changeFieldValue.bind(this);
    this.sendFriendRequest = this.sendFriendRequest.bind(this);

    this.socket = io("ws://localhost:8000", { transports: ["websocket"], 'force new connection': true });

    this.socket.on("new friend", data => {
      let new_li = document.createElement('li');
      new_li.innerHTML = data.id;
      document.getElementById('friend_request_list').appendChild(new_li); 
    });

  }

  componentWillMount() {
    axios
      .post("/api/user/checkAuth")
      .then(response => {
        console.log(response.data.user);
        this.setState(
          { isAuthenticated: true, user: response.data.user },
          () => {
            console.log(this.state.user.friend_requests);
          }
        );
      })
      .catch(error => {
        console.log(error);
        window.location = "/";
      });
  }

  changeFieldValue(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  signOut() {
    axios
      .post("/api/user/logout")
      .then(response => {
        window.location = "/";
      })
      .catch(error => console.log(error));
  }

  sendFriendRequest() {
    let friend_id = this.state.friend_request_id;
    let user_id = this.state.user.id;
    let user_name = this.state.user.name;

    axios
      .post("/api/friend/add_friend_request", {
        friend_id,
        user_id,
        user_name
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => console.log(error.response.data));
  }

  render() {
    return (
      <div className="Main" id="main">
        <div className="row">
          <div className="col s6">
            <h5>{this.state.user.name}</h5>
          </div>
          <div className="col s6 right-align">
            <button id="sign-out-btn" onClick={this.signOut}>
              <i className="fas fa-sign-out-alt" />
              &nbsp;Sign Out
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col m3">
            <h6>online friends</h6>
            <input
              type="text"
              name="friend_request_id"
              onChange={this.changeFieldValue}
              value={this.state.friend_request_id}
              placeholder="User ID"
            />
            <button className="btn right" onClick={this.sendFriendRequest}>
              <i className="fas fa-plus" />
              &nbsp;Add Friend
            </button>
            <FriendRequests friend_requests={this.state.user.friend_requests} />
          </div>

          <div className="col m9">
            <ChatArea />
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
