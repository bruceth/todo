import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.css';

let elRoot = document.getElementById('root');
if (!elRoot) {
	elRoot = document.createElement('div');
	elRoot.style.display = 'none';
	document.body.append(elRoot);
}
ReactDOM.render(<App />, elRoot);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
