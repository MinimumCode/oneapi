var should = require('should');
const fs = require('fs')
require('custom-env').env()
const apictrl = require('../../modules/apicontroller')


describe('regexSearchString', function () {

    var haystack =
            `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.The Needle is here. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`

    it('should be able to search strings using regex', function () {
        var result = apictrl.regexSearchString("Needle.*here", haystack)
        var expect = 'Needle is here'
        result.should.be.a.toString()
        should.equal(result, expect,'regexSearchString expected didnt match actual')
    })
    it('should not return any string if there is no match',function(){
        var result = apictrl.regexSearchString("Elephant", haystack)
        should.equal(result, null,'regexSearchString expected didnt match actual')
    })
})

describe('saveLicenseStatus', function(){
    it('should be able to copy license status data to data/license_status', function() {
        fs.copyFileSync(__dirname + '/license_status.copy' , __dirname + '/license_status')
        apictrl.saveLicenseStatus( __dirname + '/license_status', function(status){
            should.equal(status,200)
            fs.existsSync(__dirname + '/license_status').should.not.be.true()
            fs.existsSync( process.env.ROOT_DATA_DIR + '/license_status/cilgeolicsr1_kappa/license_status').should.be.true()
        })
    })
})

describe('saveIncomingData', function(){
    it(`should receive and copy incoming data to ${process.env.INCOMING_DIR}`, function(){
        //TODO: Create test simulating upload.
    })
})

describe('generateIncomingFilename', function(){
    it('should be able to create unique filename for archive data', function(){
        var results = apictrl.generateIncomingFilename('archive')
        results.should.be.a.toString()
        var regex = /archive-.*.in/g
        var found = results.match(regex)
        should.notEqual(found[0],null,'Unable to generate archive filename')
    })

    it('should be able to create unique filename for incoming data', function(){
        var results = apictrl.generateIncomingFilename('incoming')
        results.should.be.a.toString()
        var regex = /incoming-.*.in/g
        var found = results.match(regex)
        should.notEqual(found[0],null,'Unable to generate incoming filename')
    })

    it('should be able to create unique filename for unknown data', function(){
        var results = apictrl.generateIncomingFilename()
        results.should.be.a.toString()
        var regex = /unknown-.*.in/g
        var found = results.match(regex)
        should.notEqual(found[0],null,'Unable to generate unknown filename')
    })

})

describe('requestConfig', function(){
    it('it should be able to return requested config',function(){
        apictrl.requestConfig('license', function(contents,status){
            contents.should.be.String()
            should.equal(status,200,'Got wrong status code')
            should.notEqual(contents, '', 'Got empty return')
        })
    })
    it('it should not be able to return restricted config',function(){
        apictrl.requestConfig('product-mapping', function(contents,status){
            contents.should.be.String()
            should.equal(status,401,'Got wrong status code')
            should.notEqual('Error: Requested Config is not allowed for request', '', 'Got empty return')
        })
    })
})