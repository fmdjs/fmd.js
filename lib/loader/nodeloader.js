/**
 * @module fmd/nodeloader
 * @author Edgar <mail@edgar.im>
 * @version v0.1
 * @date 170104
 * */

var path = require('path');

fmd( 'nodeloader', ['config', 'module'], function( config, Module ){
    'use strict';

    var original = Module.get;

    Module.get = function( id ){

        var pathId = path.join( config.get('basePath'), id );

        require( pathId );

        return original( id );
    };

} );
