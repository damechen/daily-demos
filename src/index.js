import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import firebase from 'firebase/app';
import 'firebase/analytics';

import './index.css';
import App from './components/App/App';
import BrowserUnsupported from './components/BrowserUnsupported/BrowserUnsupported';
import DailyIframe from '@daily-co/daily-js';

var firebaseConfig = {
  apiKey: 'AIzaSyA5AshmLFeonS9iui9ldNKA0Mcha6wrPpE',
  authDomain: 'lonely-dev.firebaseapp.com',
  databaseURL: 'https://lonely-dev.firebaseio.com',
  projectId: 'lonely-dev',
  storageBucket: 'lonely-dev.appspot.com',
  messagingSenderId: '892358178598',
  appId: '1:892358178598:web:76820dbb68bfa2cc75f3e7',
  measurementId: 'G-3P3PYFWC5C',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(
  <Router>
    {DailyIframe.supportedBrowser().supported ? (
      <App />
    ) : (
      <BrowserUnsupported />
    )}
  </Router>,

  document.getElementById('root')
);
