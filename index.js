var express = require('express')
const app = express()
const port = process.env.PORT
var os = require('os')
const appctrl = require('./modules/apicontroller')
require('custom-env').env()
var fqdn = require('node-fqdn')

app.use(express.bodyParser())

app.get('/api/', function (req, res) {
    res.send('Hello welcome to One Api.');
})

app.get('/api/v1/coreserver/info', function (req, res) {
    console.log(' -- Got coreserver info request')
    res.send('{"host":"' + fqdn() + '","version":"6.5.1.14","patches":[]}')
})

app.get('/api/v1/', function (req, res) {
    res.send('Welcome to One Api V1')
})

app.get('/api/v1/config/:fileId', function (req, res) {
    appctrl.requestConfig(req.params.fileId, function (data, status) {
        res.status(status)
        res.send(data)
    })
})

app.post('/api/v1/client', function(req,res){
    req.body
    res.send()
})

app.get('/api/v1/client/:hostId', function (req, res) {
    console.log(`Got request for client status ID: + ${req.params.hostId}`)
    res.send('{"hostname":' + req.params.hostId + ',"version":"6.5.1.14","last_contact":"500","installed_modules":["LicenseAnalyzer","LicenseOptimizer"]}')
})

app.listen(port, function () {
    console.log(`One Api listening on port ${port}!`)
})

//WIP 
app.get('/api/v1/run', function (req, res) {
    appctrl.runAsynBinCommand('test', 'test', function (data) {
        res.send(data)
    })
})

//WIP
app.get('/api/v1/doload', function (req, res) {
    appctrl.runAsynBinCommand('do_load.bat', function (data, status) {
        res.status(status)
        res.send(data)
    })
})



app.post('/api/v1/upload', function (req, res) {
    appctrl.saveIncomingData(req, function (status) {
        res.status(status)
        res.send()
    })
})