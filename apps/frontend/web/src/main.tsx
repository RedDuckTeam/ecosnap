import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import { Buffer } from 'buffer';

import { App } from './App';

window.Buffer = Buffer;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
