var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const path = require("path");

const loggingEnabled = true;

// img schema
const imgSchema = new Schema({
    img: { data: Buffer, contentType: String },
    name: String
});

const imgPath = './vendorImg';

const vendorImgs = {
    'cvs': { 'imgName': 'cvs.png' },
    'nysc': { 'imgName': 'nysc.png' },
    'riteaid': { 'imgName': 'riteaid.png' },
    'amazon': { 'imgName': 'amazon.png' }
};

exports.removeImages = function() {
    const vendorModel = mongoose.model('vendor')

    vendorModel.deleteMany(function (err) {
        if (err) throw err;
    });
    console.error('Removed docs from vendors collection');
}

exports.uploadImages = function() {
    if(loggingEnabled) console.log('vendorAccess::uploadImages');

    // List of vendors taken from object
    const vendors = Object.keys(vendorImgs);

    // Model of vendors
    var vendorModel = mongoose.model('vendor', imgSchema);

    vendors.forEach(function(vdr) {
        var vendorData = vendorImgs[vdr] || {};
        var vendorImg = vendorData[ 'imgName' ] || null;
        if( !vendorImg ) {
            console.error( "Could not find - " + vendorImg );
            return;
        }

        // location of image - e.g. 'PATH/TO/IMG.PNG'
        var vendorImgLoc = imgPath + '/' + vendorImg;

        // Create document instance for vendor
        var vendorDoc = new vendorModel;

        // Save image to vendors collection
        vendorDoc.img.data = fs.readFileSync(path.resolve(__dirname, vendorImgLoc));
        vendorDoc.img.contentType = 'image/png';
        vendorDoc.name = vdr;

        vendorDoc.save(function (err) {
           if (err) return handleError(err);
           console.log('saved ' + vendorDoc.name + ' to vendors collection');
        });
    });


}