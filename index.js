var debug = require("debug")("sails:hook:sanpassport");
var sanpassport = require("sanpassport");
var _ = require('lodash');

module.exports = function indexes(sails) {
  return {
    //Default config
    defaults: {},
    //Hook config
    configure: function () {
      if(!sails.config.passport || !sails.config.passport.strategies){
        sails.config.passport = {
          strategies: [
            {
              name: 'local',
              model: 'user'
            }
          ]
        };
      }
    },
    //Start hook
    initialize: function (cb) {
      var eventsToWaitFor = ['hook:orm:loaded','hook:http:loaded', 'hook:policies:loaded'];
      sails.after(eventsToWaitFor, function() {
        var strategies = _.map(sails.config.passport.strategies, (strategy) => {
          strategy.model = sails.models[strategy.model];
          return strategy;
        });
        sails.sanpassport = sanpassport(
          strategies,
          sails.config.passport.ensureAuthenticated
        );

        sails.hooks.http.app.stack = sessionPAP(sails.hooks.http.app.stack, sails.sanpassport);

        sails.hooks.policies.middleware.sessionauth = sails.sanpassport.authenticate;
        sails.hooks.policies.middleware.sessionauth.identity = "sessionauth";
        sails.hooks.policies.middleware.sessionauth.globalId = "sessionAuth";
        sails.hooks.policies.middleware.sessionauth.sails = sails;

        sails.hooks.policies.middleware.locallogin = sails.sanpassport.local.login;
        sails.hooks.policies.middleware.locallogin.identity = "locallogin";
        sails.hooks.policies.middleware.locallogin.globalId = "localLogin";
        sails.hooks.policies.middleware.locallogin.sails = sails;

        sails.hooks.policies.middleware.logout = sails.sanpassport.logout;
        sails.hooks.policies.middleware.logout.identity = "logout";
        sails.hooks.policies.middleware.logout.globalId = "logout";
        sails.hooks.policies.middleware.logout.sails = sails;

        cb();
      });
    },
    //Routes
    routes: {}
  };
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
