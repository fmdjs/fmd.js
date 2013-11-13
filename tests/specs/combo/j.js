define( 'specs/combo/j1', ['module'], function( module ){
    module.exports = 'j1';
} );

define( 'specs/combo/j', ['exports','require','specs/combo/j2'], function( exports, require, J2 ){
    exports.a = require('specs/combo/j1')+J2+'j';
} );
