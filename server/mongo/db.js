var MongoClient = require('mongodb').MongoClient

var state = {
  db: null,
  comments: null
}

exports.connect = function(url, done) {
  if (state.db) return done()

  MongoClient.connect(url, function(err, db) {
    let dbName = "SmokingData"

    if (err) return done(err);

    console.log("Connecting to " + dbName)

    state.db = db;                      // Database
    var commentBase = db.db(dbName);    // Creates comments db instance
    state.comments = commentBase;

    done()
  })
}

exports.getComments = function() {
    return state.comments;
}

exports.get = function() {
  return state.db;
}

exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null
      state.mode = null
      done(err)
    })
  }
}