var debug = require("debug")("sails:hook:sanpassport");
var sanpassport = require("sanpassport");

module.exports = function indexes(sails) {
  return {
    //Default config
    defaults: {},
    //Hook config
    configure: function () {
      if(!sails.config.passport || !sails.config.passport.model){
        sails.config.passport = {
          model: "user"
        }
      }
    },
    //Start hook
    initialize: function (cb) {
      var eventsToWaitFor = ['hook:orm:loaded', 'hook:http:loaded', 'hook:policies:loaded'];
      sails.after(eventsToWaitFor, function() {		
        sails.sanpassport = sanpassport(
          sails.models[sails.config.passport.model], sails.config.passport.redirectCB,
          sails.config.passport.strategyFun,
          sails.config.passport.ensureAuthenticated
        );

        sails.hooks.http.app.stack = sessionPAP(sails.hooks.http.app.stack, sails.sanpassport);
        
        sails.hooks.policies.middleware.sessionauth = sails.sanpassport.ensureAuthenticated;
        sails.hooks.policies.middleware.sessionauth.identity = "sessionauth";
        sails.hooks.policies.middleware.sessionauth.globalId = "sessionAuth";
        sails.hooks.policies.middleware.sessionauth.sails = sails;
        
        sails.hooks.policies.middleware.ensureadmin = sails.sanpassport.ensureAdmin;
        sails.hooks.policies.middleware.ensureadmin.identity = "ensureadmin";
        sails.hooks.policies.middleware.ensureadmin.globalId = "ensureAdmin";
        sails.hooks.policies.middleware.ensureadmin.sails = sails;

        cb();
      });
    },
    //Routes
    routes: {}
  }
};

function sessionPAP(stack, sanpassport) {
  var stackR = [];
  var item;
  var bandera = true;
  var stackLength = (stack.length)? stack.length: 0;
  for (var index = 0; index < stackLength; index++) {
    item = stack[index];
    stackR.push(item);
    if(!item.handle.name){
      stackR.push({route: item.route, handle: sanpassport.initialize});      
      stackR.push({route: item.route, handle: sanpassport.session});
    }
  }
  return stackR;
}
