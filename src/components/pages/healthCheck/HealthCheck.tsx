import { Navigator, Page } from 'react-onsenui';
import UserSearch from './UserSearch';
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
                case 'search':
                    return <UserSearch navigator={navigator}/>;
                case 'patient':
                    return <PatientInfo navigator={navigator}/>
                case 'summary':
                    return <HealthCheckTabs/>
                }
                return <Page>{route.id}: Not found</Page>;
            }}
            initialRoute={{id: 'search', title: 'Select User'}}></Navigator>
    )
}


export default HealthCheck;
