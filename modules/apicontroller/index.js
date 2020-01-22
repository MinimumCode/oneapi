const crypto = require('crypto')
var fs = require('fs')
const formidable = require('formidable')
const {
    spawn
} = require('child_process')
const ApiController = {

    getServerInfo: function () {

    },

    requestConfig: function (file, callback) {

        // Not all config should be accessible 
        var configs = ['certificate', 'acc_types', 'license']

        var results = configs.find((config) => config === file)

        if (!results) {
            callback('Error: Requested Config is not allowed for request', 401)
            return
        }

        var requested_config = process.env.CONFIG_DIR + '/' + file

        if (file == 'certificate')
            requested_config = process.env.SERVER_PUBLIC_CERTIFICATE

        fs.readFile(requested_config, 'utf8', function (err, contents) {
            if (err) throw err
            console.log(`Reading file ${requested_config}`)
            callback(contents, 200)
        })


    },

    generateIncomingFilename: function (incomingtype) {

        if (!incomingtype)
            incomingtype = 'unknown'

        var epoch = ((new Date).getTime()).toString()
        hash_code = crypto.createHash('sha1').update(epoch).digest('hex')
        var filename = process.env.INCOMING_DIR + incomingtype + "-" + epoch + "-" + hash_code + ".in"

        if (fs.existsSync(filename)) {
            //Make another random filename if file exists
            var random = Math.random().toString()
            hash_code = crypto.createHash('sha1').update(epoch + random).digest('hex')
            filename = process.env.INCOMING_DIR + incomingtype + "-" + epoch + "-" + hash_code + ".in"
        }

        return filename
    },

    saveLicenseStatus: function (source, callback) {
        // Get Product name 
        var contents = fs.readFileSync(source, 'utf8')
        var prod = this.regexSearchString('^product=.*$', contents)
        prod = prod.replace(/^product=/g, '')
        prod = prod.replace(/;/g, '_')

        // Generate folder using product name 
        var destination = process.env.ROOT_DATA_DIR + '/license_status/' + prod
        if (!fs.existsSync(destination))
            fs.mkdirSync(destination)

        // Actual saving license status
        destination += '/license_status'
        fs.rename(source, destination, function (err) {
            if (err) throw err
            console.log(`Debug: Updating license status for '${prod}'. Moved to '${destination}'.`)
            callback(200)
        })

    },

    saveIncomingData: function (req, callback) {
        var form = new formidable.IncomingForm()
        var ctrl = this
        form.parse(req, function (err, fields, files) {

            var source = files.data.path

            if (req.headers.incomingtype == 'licensestatus') {
                ctrl.saveLicenseStatus(source, function (status) {
                    callback(200)
                })
            } else {
                // Any other files will go to incoming
                var destination = ctrl.generateIncomingFilename(req.headers.incomingtype)
                fs.rename(source, destination, function (err) {
                    if (err) {
                        callback(500)
                        throw err
                    }
                    console.log(`Debug: Upload success. Moved '${source}' to '${destination}'.`)
                    callback(200)
                })
            }
        })
    },

    regexSearchString: function (findstr, contents) {
        var re = new RegExp(findstr, 'm')
        var results = re.exec(contents)
        if (results == null) return null
        return results[0]
    },

    runAsynBinCommand: function (app, args, callback) {
        //WIP
        const cmd = spawn('cmd.exe', [process.env.BIN_DIR + '/' + app])
        console.log(`Running ${process.env.BIN_DIR}/${app} `)
        cmd.stdout.on('data', function (data) {
            callback(data.toString(), 200)
        })

        cmd.stderr.on('data', function (data) {
            callback(data.toString(), 500)
        })

        cmd.on('close', function (code) {
            status = 500
            if (code == 0)
                status = 200
            console.log(`exit status ${code}`)
            callback(data.toString(), status)
        })
    }
}
module.exports = ApiController