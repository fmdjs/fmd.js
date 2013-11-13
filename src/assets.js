/**
 * @module fmd/assets
 * @author Edgar <mail@edgar.im>
 * @version v0.1
 * @date 131014
 * */


fmd( 'assets', ['cache','lang','event','config','module'],
    function( cache, lang, event, config, Module ){
    'use strict';
    
    var assetsCache = cache.assets = {},
        id2urlMap = {};
    
    var assets = {
        make: function( id ){
            
            if ( id2urlMap[id] ){
                return assetsCache[ id2urlMap[id] ];
            }
            
            var asset = { id: id };
            
            event.emit( 'analyze', asset );
            
            Module.has( asset.id ) ? ( asset.url = asset.id ) : event.emit( 'id2url', asset );
            
            id2urlMap[id] = asset.url;
            
            return ( assetsCache[asset.url] = asset );
        },
        
        group: function( ids ){
            return lang.map( ids, function( id ){
                return assets.make( id );
            } );
        }
    };
    
    
    return assets;
    
} );
