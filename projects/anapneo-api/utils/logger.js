var logEnabled = true;
var debugEnabled = false;

exports.log = function(msg) {
                  if(logEnabled){
                    console.log(msg);
                  }
                }
exports.debug = function(msg){
                  if(debugEnabled){
                    console.log(msg);
                  }
                }
