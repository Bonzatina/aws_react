import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {CognitoUserPool, AuthenticationDetails, CognitoUser} from 'amazon-cognito-identity-js';
import AWS, {CognitoIdentityCredentials} from 'aws-sdk';
import { util } from 'aws-sdk/global';

import config from './config.js';

//const apigClient = global.apigClientFactory.newClient();


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      userToken: null,
    };
  }

  updateUserToken(userToken) {
    this.setState({userToken: userToken});
  };

  handleUsernameChange(event) {
    this.setState({username: event.target.value});
  };

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  };

  login(username, password) {
    const userPool = new CognitoUserPool({
      UserPoolId: config.UserPoolId,
      ClientId: config.ClientId
    });
    const authenticationData = {
      Username: username,
      Password: password
    };

    const user = new CognitoUser({Username: username, Pool: userPool});
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) => (
      user.authenticateUser(authenticationDetails, {
        onSuccess: (result) => resolve(result.getIdToken().getJwtToken()),
        onFailure: (err) => reject(err),
      })
    ));
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const jwtToken = await this.login(this.state.username, this.state.password);
      const decodeJwtToken = jwtToken.split('.')[0];
     // const expiration = JSON.parse(util.base64.decode(decodeJwtToken).toString('utf8'));

      console.log(decodeJwtToken);
      this.updateUserToken(jwtToken);
    }
    catch (e) {
      console.log(e);
    }
  };

  handleLogout = (event) => {
    // cognitoUser.signOut();
    // AWS.config.credentials.clearCachedId();
    this.updateUserToken(null);
  };



  render() {
    // apigClient.identityGet({});
    AWS.config.region = "us-east-1";
    AWS.config.credentials = new CognitoIdentityCredentials({IdentityPoolId: config.IdentityPoolId,});

    let accessKeyId, secretAccessKey, sessionToken;

    var additionalParams = {
      headers: {
        Authorization: this.state.userToken
      }}

    AWS.config.credentials.get(function () {
      accessKeyId = AWS.config.credentials.accessKeyId;
      secretAccessKey = AWS.config.credentials.secretAccessKey;
      sessionToken = AWS.config.credentials.sessionToken;

      const apigClient = global.apigClientFactory.newClient({
        accessKey: accessKeyId,
        secretKey: secretAccessKey,
        sessionToken: sessionToken,
        region: "us-east-1"
      });



      console.log(additionalParams)
      apigClient.identityiamGet({}, {}, additionalParams)
        .then(function (result) {
          console.log(result)
        }).catch(function (er) {
        console.log(er)
      });
    });


    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div className="mainArea">
          {this.state.userToken ?
           <div>
             Success Logged
             <button onClick={this.handleLogout}>Log out</button>
           </div>
            :
           <div>
             <form className="loginForm" onSubmit={this.handleSubmit}>
               reacttest
               <input type="text" placeholder="username" value={this.state.username} onChange={this.handleUsernameChange.bind(this)} />
               <input type="password" placeholder="password" value={this.state.password} onChange={this.handlePasswordChange.bind(this)} />
               <input type="submit" />
             </form>
           </div>
          }

        </div>
      </div>
    );
  }
}

export default App;
