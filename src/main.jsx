import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import GymApp from './gym/App';
import { store as gymStore } from './gym/store';
import B2BApp from './b2b/App';
import { store as b2bStore } from './b2b/store';
import AIApp from './ai/App';
import { store as aiStore } from './ai/store';

import './index.css';

// Build-time decision via Vercel env var:
//   VITE_PRODUCT=gym  -> gym CRM (default)
//   VITE_PRODUCT=b2b  -> B2B CRM
//   VITE_PRODUCT=ai   -> Aether AI image/video studio
// Each Vercel project sets its own var, so the same git repo produces distinct deployments.
const PRODUCT = import.meta.env.VITE_PRODUCT || 'gym';
const App = PRODUCT === 'b2b' ? B2BApp : PRODUCT === 'ai' ? AIApp : GymApp;
const store = PRODUCT === 'b2b' ? b2bStore : PRODUCT === 'ai' ? aiStore : gymStore;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
