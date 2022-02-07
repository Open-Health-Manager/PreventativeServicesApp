import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Search from '../pages/search/Search';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={Search} /> 
        <Route exact path='/search' component={Search} />
      </Switch>
    </Router>
  );
}

export default App;
