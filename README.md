# sails-hook-sanpassport

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]
  [![Build Status](https://travis-ci.org/sanjorgek/sails-hook-sanpassport.svg?branch=master)](https://travis-ci.org/sanjorgek/sails-hook-sanpassport)
  [![Code Climate](https://codeclimate.com/github/sanjorgek/sails-hook-sanpassport/badges/gpa.svg)](https://codeclimate.com/github/sanjorgek/sails-hook-sanpassport)
  [![Issue Count](https://codeclimate.com/github/sanjorgek/sails-hook-sanpassport/badges/issue_count.svg)](https://codeclimate.com/github/sanjorgek/sails-hook-sanpassport)
  [![bitHound Overall Score](https://www.bithound.io/github/sanjorgek/sails-hook-sanpassport/badges/score.svg)](https://www.bithound.io/github/sanjorgek/sails-hook-sanpassport)
  [![bitHound Dependencies](https://www.bithound.io/github/sanjorgek/sails-hook-sanpassport/badges/dependencies.svg)](https://www.bithound.io/github/sanjorgek/sails-hook-sanpassport/master/dependencies/npm)
  [![bitHound Dev Dependencies](https://www.bithound.io/github/sanjorgek/sails-hook-sanpassport/badges/devDependencies.svg)](https://www.bithound.io/github/sanjorgek/sails-hook-sanpassport/master/dependencies/npm)
  [![bitHound Code](https://www.bithound.io/github/sanjorgek/sails-hook-sanpassport/badges/code.svg)](https://www.bithound.io/github/sanjorgek/sails-hook-sanpassport)
  
[Passport](https://www.npmjs.com/package/passport) hook for [Sails.org](http://sailsjs.org/)

  [![NPM][downloads-chart]][chart-url]

# About
Before use this hook you need to read [sanpassport](https://www.npmjs.com/package/sanpassport) settings.

# Use
Install
	
	$ npm install sails-hook-sanpassport

Create `config/passport.js`

```js
module.exports.passport = {
	model: "user",
	//optional
	strategyFun: null,
  //optional
  ensureAuthenticated: null
}
```

Model settings

```js
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
```

AuthController options

```js
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
```

Policies settings

```js
module.exports.policies = {
  UserController: {
    '*': ['sessionAuth']
  },
  AuthController: {
    login: ['login'],
    logout: ['logout']
  }
};
```

Routes options

```js
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
```


[npm-image]: https://img.shields.io/npm/v/sails-hook-sanpassport.svg
[npm-url]: https://npmjs.org/package/sails-hook-sanpassport
[downloads-image]: https://img.shields.io/npm/dm/sails-hook-sanpassport.svg
[downloads-url]: https://npmjs.org/package/sails-hook-sanpassport
[downloads-chart]: https://nodei.co/npm-dl/sails-hook-sanpassport.png?months=6&height=1
[chart-url]: https://nodei.co/npm/sails-hook-sanpassport/
