var debug = require("debug")("sails:hook:sanpassport");
var passport = require("passport");
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
			var eventsToWaitFor = ['hook:orm:loaded'];
			sails.after(eventsToWaitFor, function() {
				sails.sanpassport = sanpassport(
					passport, 
					sails.models[sails.config.passport.model], sails.config.passport.redirectCB);
				cb();
			});
		},
		//Routes
    routes: {}
	}
};