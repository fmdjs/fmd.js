define( 'specs/async/j1', ['module'], function( module ){
    module.exports = 'j1';
} );

define( 'specs/async/j', ['exports','require','specs/async/j2'], function( exports, require, J2 ){
    exports.a = require('specs/async/j1')+J2+'j';
} );
