/**
 * @module fmd/use
 * @author Edgar <mail@edgar.im>
 * @version v0.2
 * @date 131015
 * */


fmd( 'use', ['lang','event','module','remote'],
    function( lang, event, Module, remote ){
    'use strict';
    
    event.on( 'makeRequire', function( require, mod ){
        
        require.use = function( ids, callback ){
            
            lang.isArray( ids ) || ( ids = [ids] );
            
            remote.fetch( { id: mod.id, deps: ids }, function( group ){
                var args = lang.map( group, function( asset ){
                    return Module.require( asset.id );
                } );
                
                callback && callback.apply( null, args );
            } );
        };
    } );
    
} );
