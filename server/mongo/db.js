var express = require('express');
var mongoose = require('mongoose');

var state = {
  db: null,
  comments: null
}

exports.connect = function(url, done) {
  if (state.db) return done()

  mongoose.connect(url, function(err, db) {
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