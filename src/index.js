import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import App from './App';
import NavbarTop from './NavbarTop';
import Connection from './Connection';

ReactDOM.render(<NavbarTop />, document.getElementById('navbartop'));
ReactDOM.render(<App />, document.getElementById('content'));
ReactDOM.render(<Connection />, document.getElementById('connection'));

function tick() {
    ReactDOM.render(<App />, document.getElementById('content'));
  }
setInterval(tick, 1000);
//ReactDOM.render(<App />, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
