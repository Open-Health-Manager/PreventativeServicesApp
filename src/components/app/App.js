import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Search from '../pages/search/Search';
import HealthCheck from '../pages/healthCheck/HealthCheck';

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
