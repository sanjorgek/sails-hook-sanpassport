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
			var eventsToWaitFor = ['hook:orm:loaded', 'hook:http:loaded'];
			sails.after(eventsToWaitFor, function() {
				sails.sanpassport = sanpassport(
					sails.models[sails.config.passport.model], sails.config.passport.redirectCB,
					sails.config.passport.strategyFun);
				sails.hooks.http.app.stack = sessionPAP(sails.hooks.http.app.stack, sails.sanpassport);
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
	while(stack.length && stack.length>0 && bandera){
		item = stack.pop()
		if(!item.handle.name){
			stackR.push({route: item.route, handle: sanpassport.session});
			stackR.push({route: item.route, handle: sanpassport.initialize});
		}
		stackR.push(item);
	}
	while(stackR.length>0){
		stack.push(stackR.pop());
	}
	return stack;
}