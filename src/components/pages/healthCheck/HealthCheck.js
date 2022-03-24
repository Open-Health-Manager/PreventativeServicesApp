import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import UserSearch from './UserSearch';
import PatientInfo from './PatientInfo';
import Summary from './Summary';

function HealthCheck() {
    return (
        <Router>
            <Switch>
                <Route exact path='/health' component={UserSearch} />
                <Route exact path='/health/patient' component={PatientInfo} />
                <Route exact path='/health/summary' component={Summary} />
            </Switch>
       </Router>
    ) 
}


export default HealthCheck;
