/**
 * @module fmd/remote
 * @author Edgar <mail@edgar.im>
 * @version v0.1
 * @date 131112
 * */


fmd( 'remote', ['lang','event','module','assets','when','loader'],
    function( lang, event, Module, assets, when, loader ){
    'use strict';
    
    var remote = {};
    
    remote.bring = remote.get = function( assetsGroup, callback ){
        
        when.apply( null, lang.map( assetsGroup, function( asset ){
            return function( promise ){
                
                Module.has( asset.id ) ?
                    promise.resolve() : loader( asset, function(){
                        promise.resolve();
                    } );
            };
        } ) ).then( callback );
    };
        
    remote.fetch = function( ids, callback ){
        
        var assetsGroup = assets.group( ids );
        
        event.emit( 'fetch', assetsGroup );
        
        remote.bring( assetsGroup, function(){
            
            when.apply( null, lang.map( assetsGroup, function( asset ){
                return function( promise ){
                    
                    var mod = Module.get( asset.id );
                    
                    mod && !mod.compiled && mod.deps.length ? remote.fetch( mod.deps, function(){
                        promise.resolve();
                    } ) : promise.resolve();
                };
            } ) ).then( function(){
                callback.call( null, assetsGroup );
            } );
        } );
    };
    
    
    return remote;
    
} );
