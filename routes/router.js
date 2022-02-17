const express = require('express'); 
const router = express.Router();
const axios = require('axios');
const https = require('https');
const qs = require('qs');
const mkFhir = require('fhir.js');

const fhir_client = mkFhir({
    baseUrl: 'http://hapi.fhir.org/baseR4'
});


//Get information of Patient by searching through FHIR Client via Patient ID 
router.post("/patient", function (req, res) {
    const { patientID } = req.body;
    console.log("req", req.body);
    fhir_client.read({type: 'Patient', patient: patientID})
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


//1574669

module.exports = router;


