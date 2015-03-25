/**
 * @module fmd.js in node
 * @author Edgar
 * @date 131118
 * */
 
var vm = require('vm'),
    fs = require('fs'),
    path = require('path');

var boot = function( fmdPath ){
    
    var code = fs.readFileSync( path.join( __dirname, fmdPath ), 'utf8' );
    //code = code.replace( /}\)\(\s?this\s?\)/, '})(exports)' );
    
    var sandbox = require('./sandbox.js');
    vm.runInNewContext( code, sandbox, 'fmd.vm' );
    
    global.fmd = sandbox.fmd;
    global.define = sandbox.define;
};

boot('../dist/fmd.js');

module.exports = global.fmd;
