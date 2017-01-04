/**
 * @module fmd/boot
 * @author Edgar <mail@edgar.im>
 * @version v0.3
 * @date 170104
 * */


(function( global ){
    'use strict';

    if ( global.fmd ){
        return;
    }
    
    
    var partsCache = {},
        parts = [];
    
    var require = function( id ){
        
        return partsCache[id];
    },
    
    fmd = function( id, deps, factory ){
        
        if ( partsCache[id] ){
            return;
        }
        
        if ( !factory ){
            factory = deps;
            deps = [];
        }
        
        if ( 'function' === typeof factory ){
            var args = [];
            
            for ( var i = 0, l = deps.length; i < l; i++ ){
                args.push( require( deps[i] ) );
            }
            
            factory = factory.apply( null, args );
        }
        
        partsCache[id] = factory || 1;
        parts.push( id );
        
    };
    
    
    fmd.version = '@VERSION';
    
    fmd.cache = {
        parts: parts
    };
    
    
    fmd( 'global', global );
    
    fmd( 'require', function(){
        
        return require;
    } );
    
    fmd( 'env', function(){
        
        return fmd;
    } );
    
    fmd( 'cache', function(){
        
        return fmd.cache;
    } );
    
    
    global.fmd = fmd;
    
})( typeof window !== 'undefined' ? window : global );
