/**
 * @module fmd/loader
 * @author Edgar <mail@edgar.im>
 * @version v0.3
 * @date 170105
 * */


fmd( 'loader', ['global','event','config','request'],
    function( global, event, config, request ){
    'use strict';
    
    var STATE_LOADING = 'loading',
        STATE_LOADED = 'loaded';
        
    var noop = function(){};
    
    
    config.set({
        timeout: 10000
    });
    
    
    event.on( 'requestComplete', function( asset ){
        
        var call, queue;
        
        asset.state = STATE_LOADED;
        queue = asset.onload;

        while ( call = queue.shift() ){
            call();
        }
    } );
    
    
    var loader = function( asset, callback ){
        
        callback || ( callback = noop );
        
        if ( asset.state === STATE_LOADED ){
            callback();
            return;
        }
        
        if ( asset.state === STATE_LOADING ){
            asset.onload.push( callback );
            return;
        }
        
        asset.state = STATE_LOADING;
        asset.onload = [callback];
        
        event.emit( 'request', asset, callback );
        
        if ( asset.requested ){
            return;
        }
        
        asset.timer = global.setTimeout( function(){
            event.emit( 'requestTimeout', asset );
        }, config.get('timeout') );
        
        request( asset, function(){
            global.clearTimeout( asset.timer );
            event.emit( 'requestComplete', asset );
        } );
    };
    
    
    return loader;
    
} );
