/**
 * @module fmd/use
 * @author Edgar <mail@edgar.im>
 * @version v0.2
 * @date 131015
 * */


fmd( 'use', ['lang','event','remote'],
    function( lang, event, remote ){
    'use strict';
    
    event.on( 'makeRequire', function( require, mod ){
        
        require.use = function( ids, callback ){
            
            lang.isArray( ids ) || ( ids = [ids] );
            
            event.emit( 'use', ids, mod );
            
            remote.fetch( ids, function( assetsGroup ){
                var args = lang.map( assetsGroup, function( asset ){
                    return require( asset.id );
                } );
                
                callback && callback.apply( null, args );
            } );
        };
    } );
    
} );
