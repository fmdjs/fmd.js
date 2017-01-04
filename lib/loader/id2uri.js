/**
 * @module fmd/id2path
 * @author Edgar <mail@edgar.im>
 * @version v0.1
 * @date 170104
 * */


var path = require('path');

fmd( 'id2uri', ['event', 'config'],
    function( event, config ){
    'use strict';

    var addBasePath = function( asset ){

        ( asset.uri.charAt(0) === '/' ) || ( asset.uri = path.join( config.get('basePath'), asset.uri ) );
    };

    event.on( 'id2uri', function( asset ){

        event.emit( 'resolve', asset );
        addBasePath( asset );

    } );
} );
