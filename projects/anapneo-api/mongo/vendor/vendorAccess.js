var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const path = require("path");
var logger = require("../../utils/logger");

const loggingEnabled = true;

const imgPath = './vendorImg';
const vendorModel = getVendorModel();

exports.removeImages = function() {
    logger.log("vendorAccess::removeImages");
    const vendorModel = mongoose.model('vendor')

    vendorModel.deleteMany(function (err) {
        if (err) throw err;
    });
    console.error('Removed docs from vendors collection');
}

exports.uploadImages = function() {
    logger.log("vendorAccess::uploadImages");

    // List of vendors taken from object
    // TODO - Take from service
    const vendorImgs = {
        'cvs':      { 'imgName': 'cvs.png' },
        'nysc':     { 'imgName': 'nysc.png' },
        'riteaid':  { 'imgName': 'riteaid.png' },
        'amazon':   { 'imgName': 'amazon.png' }
    };
    const vendors = Object.keys(vendorImgs);

    vendors.forEach(function(vdr) {
        var vendorData = vendorImgs[vdr] || {};
        var vendorImg = vendorData[ 'imgName' ] || null;
        if( !vendorImg ) {
            console.error( "Could not find - " + vendorImg );
            return;
        }

        // location of image - e.g. 'PATH/TO/IMG.PNG'
        var vendorImgLoc = imgPath + '/' + vendorImg;
        var vendorDoc = createVendorDoc(vdr, vendorImgLoc, 'standard', 11216, 'image/png', vendorModel);

        // Save images to db
        vendorDoc.save(function (err) {
           if (err) return handleError(err);
           console.log('saved ' + vendorDoc.name + ' to vendors collection');
        });
    });
}


/*
    Creates a vendor doc, a model instance given the input schema

    name:           Name of vendor
    imgLoc:         Path to the image
    type:           Type of Vendor - "standard", "exclusive", etc.
    zipCode:        zipCode of the user
    contentType:    Content-type of the image
    vendorModel:    Mongoose Model
 */
function createVendorDoc(name, imgLoc, type, zipCode, contentType, vendorModel){
    // Save image to vendors collection
    var stringBuffer = fs.readFileSync(path.resolve(__dirname, imgLoc));
    var img = { data: stringBuffer, contentType };

    // Create document instance for vendor
    var vendorDoc = new vendorModel({
      _id: new mongoose.Types.ObjectId(),
      name,
      type,
      zipCode,
      img
    });

    return vendorDoc;
}

function getVendorModel(){
    // Model of vendors
    const vendorData = new Schema({
        _id: Schema.Types.ObjectId,
        img: { data: Buffer, contentType: String },
        name: String,
        type: String,
        zipCode: Number
    });
    const vendorModel = mongoose.model('vendor', vendorData);

    return vendorModel;
}
