import React from 'react';
import ReactDOM from 'react-dom/client';
import { LazyMotion, domAnimation } from 'framer-motion';
import App from './App';
import AnalyticsConsent from './components/AnalyticsConsent';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LazyMotion features={domAnimation}>
      <App />
      <AnalyticsConsent />
    </LazyMotion>
  </React.StrictMode>
);
