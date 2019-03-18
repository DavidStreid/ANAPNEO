const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const logger = require("../../utils/logger");
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
 * Creates Advocates Doc
 */
function createAdvocateDoc(name, type, address, services){
  const advocateDoc = new advocateModel({
    name, type, address, services
  });
  return advocateDoc;
}

/**
 * Returns the id for the advocate given its name
 *
 * @name, String - Advocate name
 * @return, Promise<Schema.Types.ObjectId> - Id of the advocate
 */
exports.getAdvocateIdFromName = function(name) {
  logger.debug('advocateAccess::getAdvocateFromName');
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
};

function createAddress(street, city, state, zipCode){
  return { street, city, state, zipCode };
}
exports.removeAdvocates = function() {
  logger.debug("advocateAccess::removeAdvocates");
  const advocateModel = mongoose.model('advocate')
  return advocateModel.deleteMany();
};

/**
 * Adds Mock Advocates
 *
 * @name, String - Advocate name
 */
exports.addMockAdvocates = function(name){
  logger.debug('advocateAccess::addMockAdvocates');

  const address = createAddress('775 Nostrand Ave', 'Brooklyn', 'NY', 11216);
  const services = { 'Blood Pressure': [ 'diastolic', 'systolic' ] }
  const advocateDoc = createAdvocateDoc(name, 'barber', address, services );
  return advocateDoc.save();
};
