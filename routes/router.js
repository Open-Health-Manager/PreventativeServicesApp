const express = require('express'); 
const router = express.Router();
const mkFhir = require('fhir.js');

const fhir_client = mkFhir({
    baseUrl: 'http://hapi.fhir.org/baseR4'
});

router.post("/patient", function (req, res) {
    const { patientID } = req.body;
    console.log("req", req.body);
    fhir_client.read({type: 'Patient', patient: patientID})
    .then(result => {
        var data = result.data;
        var name = data.name;
        var birthDate = data.birthDate;
        console.log(data)
        console.log(name);
        console.log(birthDate);
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


router.post("/observation", function (req, res) {
    const { patientID } = req.body;
    console.log("req", req.body);
    fhir_client.search({type: 'Observation', query: { 'patient': patientID, 'code': 'http://loinc.org%7C72166-2' }})
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

// to test with 0f26122a-8cb8-498f-8a4d-8ba9b03a13, 08fa1c04-f938-4d66-a515-9de7efb2b5, 1023

module.exports = router;


