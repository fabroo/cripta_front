import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AppClass from './AppClass';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';

import './Styles/cards.css';
import './Styles/global.css';
import './Styles/responsive.css';


ReactDOM.render(
  <React.StrictMode>
    <AppClass />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
serviceWorker.register();

