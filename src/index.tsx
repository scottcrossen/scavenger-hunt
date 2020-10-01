import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/app';
import { configureStore } from './state/configure-store';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

const store = configureStore();

const Index = hot(() => (
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>
));

ReactDOM.render(<Index />, document.getElementById('root'));
