# sails-hook-sanpassport
[Passport](https://www.npmjs.com/package/passport) hook for [Sails.org](http://sailsjs.org/)

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]

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
	redirecCB: null,
	//optional
	strategyFun: null,
  //optional
  ensureAuthenticated: null
}
~~~

[npm-image]: https://img.shields.io/npm/v/sails-hook-sanpassport.svg
[npm-url]: https://npmjs.org/package/sails-hook-sanpassport
[downloads-image]: https://img.shields.io/npm/dm/sails-hook-sanpassport.svg
[downloads-url]: https://npmjs.org/package/sails-hook-sanpassport
