var loggingEnabled = true;

exports.log = function(msg) {
                  if(loggingEnabled){
                    console.log(msg);
                  }
                }
