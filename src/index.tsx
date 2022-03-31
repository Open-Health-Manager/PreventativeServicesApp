import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/index';
import ons from 'onsenui';

import './index.css';
import App from './components/app/App';

if (ons.platform.isIPhoneX()) {
  // Deal with "the notch"
  document.documentElement.setAttribute('onsflag-iphonex-portrait', '');
  document.documentElement.setAttribute('onsflag-iphonex-landscape', '');
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

