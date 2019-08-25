import React, { Component } from "react";

// css
import "../static/css/landingPage.css";

class LandingPage extends Component {

  render() {
    return (
      <div id="landing-page-wrapper" className="">
        <div className="center">
          <h5>Messaging App | Express-MongoDB-React</h5>
          <br />
          <a href="http://localhost:8000/api/user/auth/google">
            <button className="oauth-btn btn red darken-2">
              <i className="fab fa-google-plus-g" />&nbsp;Sign-in with Google+
            </button>
          </a>
          <a href="http://localhost:8000/api/user/auth/facebook">
            <button className="oauth-btn btn blue darken-4">
              <i className="fab fa-facebook-f" />&nbsp;Sign-in with Facebook
            </button>
          </a>
        </div>
      </div>
    );
  }
}

export default LandingPage;
