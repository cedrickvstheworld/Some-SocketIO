import React, { Component } from "react";
import M from "materialize-css";

class ChatArea extends Component {

  componentWillMount() {
    M.AutoInit();
  }

  render() {
    return (
      <div>
        <h5>Message Panel</h5>
        <div id="chat-box" />
        <div className="row">
          <form className="col s12">
            <div className="row">
              <div className="input-field col s12">
                <textarea id="textarea1" className="materialize-textarea" />
                <label htmlFor="textarea1">Your Message</label>
              </div>
            </div>
          </form>
          <button>Send</button>
        </div>
      </div>
    );
  }
}

export default ChatArea;
