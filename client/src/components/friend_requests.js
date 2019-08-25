import React, { Component } from "react";

class FriendRequests extends Component {
  render() {
    let friend_requests = '';
    if (this.props.friend_requests) {
      friend_requests = this.props.friend_requests.map(friend_request => {
        return <li key={friend_request}> {friend_request} </li>;
      });
    }

    return (
      <div>
        <ul id="friend_request_list">{friend_requests}</ul>
      </div>
    );
  }
}

export default FriendRequests;
