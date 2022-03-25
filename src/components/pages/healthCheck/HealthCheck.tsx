import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import UserSearch from './UserSearch';
import PatientInfo from './PatientInfo';
import Summary from './Summary';
import CarePlan from './CarePlan';
import History from './History';

function HealthCheck() {
    return (
        <Router>
            <Switch>
                <Route exact path='/health' component={UserSearch} />
                <Route exact path='/health/patient' component={PatientInfo} />
                <Route exact path='/health/summary' component={Summary} />
                <Route exact path='/health/careplan' component={CarePlan} />
                <Route exact path='/health/history' component={History} />
            </Switch>
       </Router>
    )
}


export default HealthCheck;
