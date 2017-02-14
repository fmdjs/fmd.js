/**
 * @module fmd/resolve
 * @author Edgar <mail@edgar.im>
 * @version v0.2
 * @date 170213
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
            url;

        if ( resolveQueue ){
            for ( var i = 0, l = resolveQueue.length; i < l; i++ ){
                url = resolveQueue[i]( asset.id );

                if ( url !== undefined && url !== asset.id ){
                    break;
                }
            }
        }

        asset.url = url ? url : asset.id;
    };


    event.on( 'resolve', parseResolve );

} );
