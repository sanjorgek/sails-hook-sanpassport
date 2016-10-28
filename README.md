# sails-hook-sanpassport

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]
  [![Build Status](https://travis-ci.org/sanjorgek/sails-hook-sanpassport.svg?branch=master)](https://travis-ci.org/sanjorgek/sails-hook-sanpassport)
  
[Passport](https://www.npmjs.com/package/passport) hook for [Sails.org](http://sailsjs.org/)

# About
Before use this hook you need to read [sanpassport](https://www.npmjs.com/package/sanpassport) settings.

# Use
Install
	
	$ npm install sails-hook-sanpassport

Create `config/passport.js`
~~~js
module.exports.passport = {
	model: "user",
	//optional
	strategyFun: null,
  //optional
  ensureAuthenticated: null
}
~~~

Model settings
~~~js
module.exports = {
  attributes: {
    username: {
      type: 'string',
      unique : true,
      required : true
    },
    password: {
      type: 'string',
      minLength: 8,
      required : true
    },
    comparePassword: function(candidatePassword, cb) {
      cb(null,true);
    }
  },
};
~~~

AuthController options
~~~js
module.exports = {
  login: function(req, res){
    //
  },
  logout: function(req, res){
    //
  },
  signup: function(req, res){
    var jsonBody = req.body;
    sanpassport.createUser(jsonBody, function(err, user){
      if(err || !user){
        res.send(404);
      }else{
        res.send(200);
      }
    });
  }
}
~~~

Policies settings
~~~js
module.exports.policies = {
  UserController: {
    '*': ['sessionAuth']
  },
  UserController: {
    login: ['login'],
    login: ['logout']
  }
};
~~~

Routes options
~~~js
module.exports.routes = {
  '/': [{policy: "sessionAuth"},{
    view: 'homepage',
    locals: {
      layout: 'layout'
    }
  }],
  'post /login': "AuthController.login",
  'post /logout': "AuthController.logout",
  'post /signup': "AuthController.signup"
};
~~~


[npm-image]: https://img.shields.io/npm/v/sails-hook-sanpassport.svg
[npm-url]: https://npmjs.org/package/sails-hook-sanpassport
[downloads-image]: https://img.shields.io/npm/dm/sails-hook-sanpassport.svg
[downloads-url]: https://npmjs.org/package/sails-hook-sanpassport
