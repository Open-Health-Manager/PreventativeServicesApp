import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Search from '../pages/search/Search';
import HealthCheck from '../pages/healthCheck/HealthCheck';

// Import Onsen styles
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={Search} />
        <Route path='/search' component={Search} />
        <Route path='/health' component={HealthCheck} />
      </Switch>
    </Router>
  )
}

export default App;
