var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const path = require("path");
var logger = require("../../utils/logger");
var user = require("../users/usersAccess");

const loggingEnabled = true;
const imgPath = './vendorImg';
const vendorModel = getVendorModel();
const advocateModel = createAdvocateModel();

/**
 * Returns mongoose model for advocates
 */
exports.getAdvocateModel = function() {
  return advocateModel;
}

/**
 * Returns the id for the advocate given its name
 *
 * @name, String - Advocate name
 * @return, Schema.Types.ObjectId - Id of the advocate
 */
exports.getAdvocateIdFromName = function(name) {
  logger.debug('vendorAccess::getAdvocateFromName');
  return advocateModel.findOne({ name }).then((advocateDoc) => {
    if( advocateDoc == null ){
      logger.log(`Advocate '${name}' was NOT FOUND`);
      return;
    }
    logger.log(`Advocate '${name}' was FOUND`);
    return advocateDoc._id;
  });
}

/**
 * Adds Mock Advocates
 *
 * @name, String - Advocate name
 */
exports.addAdvocates = function(name){
  logger.debug('vendorAccess::addAdvocates');

  var address = createAddress('775 Nostrand Ave', 'Brooklyn', 'NY', 11216);
  var services = { 'Blood Pressure': [ 'diastolic', 'systolic' ] }
  var advocateDoc = createAdvocateDoc(name, 'barber', address, services );

  return advocateDoc.save();
}

/**
 * This method uses queries by a unique advocate name
 */
exports.getAdvocate = function(id){
  return advocateModel.findOne({ id }).then((advocateDoc) => {
    if( advocateDoc == null ){
      status = `Advocate Id: ${id} was not found`;
      logger.log(status);
      return;
    }
    status = `Advocate Id: ${id} was FOUND`;
    logger.log(status);
    return advocateDoc;
  });
}

/**
 * Creates address object
 */
function createAddress(street, city, state, zipCode){
  var address = { street, city, state, zipCode };
  return address;
}

/**
 * Creates Advocates Doc
 */
function createAdvocateDoc(name, type, address, services){
  var advocateDoc = new advocateModel({
    name, type, address, services
  });

  return advocateDoc;
}

/**
 * Returns Advocates Model
 *
 *    _id:      Mongoose id for advocate
 *    name:     Name of Advocate
 *    type:     Type of Business (E.g. haircut)
 *    address:  Address where advocate is located
 *    services: Health services offered by the advocate
 */
function createAdvocateModel(){
    const advocateData = new Schema({
        _id: { type: Schema.ObjectId, auto: true },
        name: String,
        type: String,
        address: Object,
        services: Object
    });
    const advocateModel = mongoose.model('advocate', advocateData);
    return advocateModel;
}

/**
 * Removes all documents from the advocates collection
 */
exports.removeAdvocates = function() {
    logger.debug("vendorAccess::removeAdvocates");
    const vendorModel = mongoose.model('advocate')
    return vendorModel.deleteMany();
}

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
