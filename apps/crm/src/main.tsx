import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import './styles.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Elementul #root lipsește din document.');
}

ReactDOM.createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
