/**
 * @module fmd/resolve
 * @author Edgar <mail@edgar.im>
 * @version v0.1
 * @date 170104
 * */


fmd( 'resolve', ['event','config'],
    function( event, config ){
    'use strict';

    config.register({
        key: 'resolve',
        name: 'array'
    });

    var parseResolve = function( asset ){

        var resolveQueue = config.get( 'resolve' ),
            uri;

        if ( resolveQueue ){
            for ( var i = 0, l = resolveQueue.length; i < l; i++ ){
                uri = resolveQueue[i]( asset.id );

                if ( uri !== asset.id ){
                    break;
                }
            }
        }

        asset.uri = uri ? uri : asset.id;
    };


    event.on( 'resolve', parseResolve );

} );
