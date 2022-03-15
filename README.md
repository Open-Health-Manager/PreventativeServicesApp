# PreventativeServicesApp
The Preventative Service application allows a user to input a Patient ID in order to query the Prevention TaskForce API to identify the screening, counseling, and preventive medication services that are appropriate for a specific patient. 

## Tech Stack
The initial app implementation is built by using React.js as the front-end web framework. Node.js and Express are used to set up a back-end server which is used to make API calls to the HAPI FHIR Server.

## Usage
### Running the PreventativeServicesApp locally
To run the PreventativeServicesApp locally:
1. first clone the repository (github repo) and open it in Visual Studio code. 
2. next cd into the client folder and install project dependencies using npm install
3. open up the Visual Studio terminal and start up the local Express server via npm run server
4. another terminal should be used to run npm start which starts the main development environment for the front-end client
5. to return a list of Preventative Services for the patient, simply type in a valid PatientID into the form and select the submit button. 
