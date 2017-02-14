/**
 * @module fmd/id2url
 * @author Edgar <mail@edgar.im>
 * @version v0.2
 * @date 170214
 * */


var path = require('path');

fmd( 'id2url', ['event', 'config'],
    function( event, config ){
    'use strict';

    config.set({
        basePath: process.cwd()
    });

    var addBasePath = function( asset ){

        ( asset.url.charAt(0) === '/' ) || ( asset.url = path.join( config.get('basePath'), asset.url ) );
    };

    event.on( 'id2url', function( asset ){

        event.emit( 'resolve', asset );
        addBasePath( asset );
    } );
} );
