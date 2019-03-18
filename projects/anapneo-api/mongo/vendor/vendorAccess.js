const fs = require('fs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const path = require("path");
const logger = require("../../utils/logger");
const imgPath = './vendorImg';
const vendorModel = getVendorModel();
const advocateModel = createAdvocateModel();

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
  return mongoose.model('advocate', advocateData);
}
exports.getAdvocateModel = function() {
  return advocateModel;
};

/**
 * Returns the id for the advocate given its name
 *
 * @name, String - Advocate name
 * @return, Promise<Schema.Types.ObjectId> - Id of the advocate
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
};

/**
 * This method uses queries by a unique advocate name
 */
exports.getAdvocate = function(id){
  return advocateModel.findOne({ id }).then((advocateDoc) => {
    let status;
    if( advocateDoc == null ){
      status = `Advocate Id: ${id} was not found`;
      logger.log(status);
      return;
    }
    status = `Advocate Id: ${id} was FOUND`;
    logger.debug(status);
    return advocateDoc;
  });
}

/**
 * Creates address object
 */
function createAddress(street, city, state, zipCode){
  return { street, city, state, zipCode };
}

/**
 * Creates Advocates Doc
 */
function createAdvocateDoc(name, type, address, services){
  const advocateDoc = new advocateModel({
    name, type, address, services
  });
  return advocateDoc;
}

/**
 * Removes all documents from the advocates collection
 */
exports.removeAdvocates = function() {
  logger.debug("vendorAccess::removeAdvocates");
  const vendorModel = mongoose.model('advocate')
  return vendorModel.deleteMany();
};

exports.removeImages = function() {
  logger.log("vendorAccess::removeImages");
  const vendorModel = mongoose.model('vendor')

  vendorModel.deleteMany(function (err) {
      if (err) throw err;
  });
  console.error('Removed docs from vendors collection');
};

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
        const vendorData = vendorImgs[vdr] || {};
        const vendorImg = vendorData[ 'imgName' ] || null;
        if( !vendorImg ) {
            console.error( "Could not find - " + vendorImg );
            return;
        }

        // location of image - e.g. 'PATH/TO/IMG.PNG'
        const vendorImgLoc = imgPath + '/' + vendorImg;
        const vendorDoc = createVendorDoc(vdr, vendorImgLoc, 'standard', 11216, 'image/png', vendorModel);

        // Save images to db
        vendorDoc.save(function (err) {
           if (err) return handleError(err);
           console.log('saved ' + vendorDoc.name + ' to vendors collection');
        });
    });
}

/**
 * Creates a vendor doc, a model instance given the input schema
 *
 *  name:           Name of vendor
 *  imgLoc:         Path to the image
 *  type:           Type of Vendor - "standard", "exclusive", etc.
 *  zipCode:        zipCode of the user
 *  contentType:    Content-type of the image
 *  vendorModel:    Mongoose Model
 */
function createVendorDoc(name, imgLoc, type, zipCode, contentType, vendorModel){
    // Save image to vendors collection
    const stringBuffer = fs.readFileSync(path.resolve(__dirname, imgLoc));
    const img = { data: stringBuffer, contentType };

    // Create document instance for vendor
    const vendorDoc = new vendorModel({
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

/**
 * Adds Mock Advocates
 *
 * @name, String - Advocate name
 */
exports.addMockAdvocates = function(name){
  logger.debug('vendorAccess::addMockAdvocates');

  const address = createAddress('775 Nostrand Ave', 'Brooklyn', 'NY', 11216);
  const services = { 'Blood Pressure': [ 'diastolic', 'systolic' ] }
  const advocateDoc = createAdvocateDoc(name, 'barber', address, services );
  return advocateDoc.save();
};
