var env = require('../environment');

exports.log = function(msg) {
                  if(env.logEnabled){
                    console.log(msg);
                  }
                }
exports.debug = function(msg){
                  if(env.debugEnabled){
                    console.log(msg);
                  }
                }
