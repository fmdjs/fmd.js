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
        make: function( id, meta ){
            
            var asset = { id: id };
            event.emit( 'analyze', asset );
            event.emit( 'relative', asset, meta );
            event.emit( 'alias', asset );
            
            if ( id2urlMap[asset.id] ){
                return assetsCache[ id2urlMap[asset.id] ];
            }
            
            Module.has( asset.id ) ? ( asset.url = asset.id ) : event.emit( 'id2url', asset );
            
            id2urlMap[asset.id] = asset.url;
            
            return ( assetsCache[asset.url] = asset );
        },
        
        group: function( meta ){
            
            return lang.map( meta.deps, function( id ){
                return assets.make( id, meta );
            } );
        }
    };
    
    
    return assets;
    
} );
