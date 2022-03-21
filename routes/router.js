const express = require('express'); 
const router = express.Router();
const axios = require('axios');
const https = require('https');
const qs = require('qs');
const mkFhir = require('fhir.js');

const fhir_client = mkFhir({
    baseUrl: 'http://ohm.healthmanager.pub.aws.mitre.org:8080/fhir/'
});


//provide a view of patient resource via a username
router.post('/search_username', function (req, res) {

    const { userName } = req.body;
    console.log("req", req.body);

    const agent = new https.Agent({
        rejectUnauthorized: false
    });

    axios({
        method: "GET",
        url: `http://ohm.healthmanager.pub.aws.mitre.org:8080/fhir/Patient?identifier=urn%3Amitre%3Ahealthmanager%3Aaccount%3Ausername%7C${userName}`,
        httpsAgent: agent,
    }).then(response => {
        var data = response.data;
        console.log(data)
        res.status(200).json(response.data);
    })
        .catch((err) => {
            console.log(err.message)
            res.status(500).json({ message: err.message });
        });
});


//Check for Smoking Status of Patient based on Patient ID 
router.post("/smoking_status", function (req, res) {
    const { patientID } = req.body;
    console.log("req", req.body);
    fhir_client.search({type: 'Observation', query: { 'patient': patientID, 'code': 'http://loinc.org|72166-2' }})
    .then(result => {
        var data = result.data;
        console.log(data)
        res.end(JSON.stringify(result, null, 4))
    })
    .catch(function(res){
        //Error responses
        if (res.status){
            console.log('Error', res.status);
        }

        //Errors
        if (res.message){
            console.log('Error', res.message);
        }
    });
});

//Check for BMI of Patient based on Patient ID 
router.post("/retrieve_bmi", function (req, res) {
    const { patientID } = req.body;
    console.log("req", req.body);
    fhir_client.search({type: 'Observation', query: { 'patient': patientID, 'code': 'http://loinc.org|39156-5' }})
    .then(result => {
        var data = result.data;
        console.log(data)
        res.end(JSON.stringify(result, null, 4))
    })
    .catch(function(res){
        //Error responses
        if (res.status){
            console.log('Error', res.status);
        }

        //Errors
        if (res.message){
            console.log('Error', res.message);
        }
    });
});

//Check for Height of Patient based on Patient ID 
router.post("/retrieve_height", function (req, res) {
    const { patientID } = req.body;
    console.log("req", req.body);
    fhir_client.search({type: 'Observation', query: { 'patient': patientID, 'code': 'http://loinc.org|8302-2' }})
    .then(result => {
        var data = result.data;
        console.log(data)
        res.end(JSON.stringify(result, null, 4))
    })
    .catch(function(res){
        //Error responses
        if (res.status){
            console.log('Error', res.status);
        }

        //Errors
        if (res.message){
            console.log('Error', res.message);
        }
    });
});

//Check for Weight of Patient based on Patient ID 
router.post("/retrieve_weight", function (req, res) {
    const { patientID } = req.body;
    console.log("req", req.body);
    fhir_client.search({type: 'Observation', query: { 'patient': patientID, 'code': 'http://loinc.org|29463-7' }})
    .then(result => {
        var data = result.data;
        console.log(data)
        res.end(JSON.stringify(result, null, 4))
    })
    .catch(function(res){
        //Error responses
        if (res.status){
            console.log('Error', res.status);
        }

        //Errors
        if (res.message){
            console.log('Error', res.message);
        }
    });
});


//Check for Blood Pressure of Patient based on Patient ID 
router.post("/retrieve_blood_pressure", function (req, res) {
    const { patientID } = req.body;
    console.log("req", req.body);
    fhir_client.search({type: 'Observation', query: { 'patient': patientID, 'code': 'http://loinc.org|85354-9' }})
    .then(result => {
        var data = result.data;
        console.log(data)
        res.end(JSON.stringify(result, null, 4))
    })
    .catch(function(res){
        //Error responses
        if (res.status){
            console.log('Error', res.status);
        }

        //Errors
        if (res.message){
            console.log('Error', res.message);
        }
    });
});


//Check if Patient has had a Colonoscopy performed 
router.post('/colonoscopy_check', function(req, res){
    const { patientID } = req.body;
    console.log("req", req.body);
    fhir_client.search({type: 'Procedure', query: { 'patient': patientID, 'code': 'http://snomed.info/sct|73761001', 'date': {$and: ['ge2020-01-01', 'le2023-12-31']}}})
    .then(result => {
        var data = result.data;
        console.log(data)
        res.end(JSON.stringify(result, null, 4))
    })
    .catch(function(res){
        //Error responses
        if (res.status){
            console.log('Error', res.status);
        }

        //Errors
        if (res.message){
            console.log('Error', res.message);
        }
    });
});

//Call Preventative Services API based on gender, age, and smoking status 
router.post('/preventatives_services', function(req, res){

    const { gender, age, smokingStatus } = req.body;
    console.log("req", req.body);

    const agent = new https.Agent({  
        rejectUnauthorized: false
    });

    axios({
        method: "GET",
        url: "https://data.uspreventiveservicestaskforce.org/api/json",
        httpsAgent: agent,
        params: {
            key: 'a49dac2626acf9ab1aef69b961e40dd2',
            age: age,
            sex: gender,
            tobacco: smokingStatus,
            grade: ["A", "B"],
        },
        paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        },
    }).then(response => {
        var data = response.data;
        res.status(200).json(response.data);
    })
    .catch((err) => {
        console.log(err.message)
        res.status(500).json({ message: err.message });
    });
});


module.exports = router;


