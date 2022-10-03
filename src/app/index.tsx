import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';

import App from './App';

const appRender = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

const rootElem = document.getElementById('root') as HTMLElement;

render(appRender, rootElem);
