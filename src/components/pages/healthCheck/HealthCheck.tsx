import { Navigator, Page } from 'react-onsenui';
import PatientInfo from './PatientInfo';
import HealthCheckTabs from './HealthCheckTabs';

function HealthCheck() {
    // HealthCheck has the following navigation: first, require a username
    // Then, load patient data for that user
    // Once that's done, move on to the tabs page
    return (
        <Navigator
            renderPage={(route, navigator) => {
                console.log('Route', route);
                console.log('Navigator', navigator);
                switch (route.id) {
                case 'patient':
                    return <PatientInfo navigator={navigator}/>
                case 'summary':
                    return <HealthCheckTabs navigator={navigator}/>
                }
                return <Page>{route.id}: Not found</Page>;
            }}
            initialRoute={{id: 'summary'}}></Navigator>
    )
}


export default HealthCheck;
