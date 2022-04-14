import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Onboarding from '../pages/dataUseAgreement/Onboarding';
import { getPatientUserName } from '../../store/patientSlice';
import HealthCheck from '../pages/healthCheck/HealthCheck';

function App() {
  // There is one very basic piece of state: the active user account
  const [userName, setUserName] = useState<string | null>(null);
  const dispatch = useDispatch();

  if (userName === null) {
    // When logged out, show the onboarding
    return <Onboarding onUserLoggedIn={(user) => {
      dispatch(getPatientUserName(user));
      setUserName(user);
    }} />;
  } else {
    // When logged in, forward to the HealthCheck widget
    return <HealthCheck />;
  }
}

export default App;
