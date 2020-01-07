import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

const client = new WebSocket('ws://127.0.0.1:7779');

class Main extends React.Component {
  componentWillMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      console.log(message);
    };
  }
  
  render() {
    return (
      <div>
      Practical Intro To WebSockets.
      </div>
    );
  }
}

export default Main;

class ChildComponent extends React.Component {

    sendMessage=()=>{
        //const {websocket} = this.props // websocket instance passed as props to the child component.

        try {
            const data = new Buffer('GET').toString('base64');
            client.send(data) //send data to the server
        } catch (error) {
            console.log(error) // catch error
        }
    }
    render() {
        return (
            <button onClick={this.sendMessage}>Send</button>
        );
    }
}

ReactDOM.render(<Main />, document.getElementById('root'));
ReactDOM.render(<ChildComponent />, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
