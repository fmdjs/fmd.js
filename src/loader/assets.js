/**
 * @module fmd/assets
 * @author Edgar <mail@edgar.im>
 * @version v0.2
 * @date 170117
 * */


fmd( 'assets', ['cache','lang','event','config','module'],
    function( cache, lang, event, config, Module ){
    'use strict';
    
    var assetsCache = cache.assets = {},
        id2uriMap = {};
    
    var assets = {
        make: function( id, meta ){
            
            var asset = { id: id };
            event.emit( 'analyze', asset );
            event.emit( 'alias', asset, meta );
            
            if ( id2uriMap[asset.id] ){
                return assetsCache[ id2uriMap[asset.id] ];
            }
            
            Module.has( asset.id ) ? ( asset.uri = asset.id ) : event.emit( 'id2uri', asset );
            
            id2uriMap[asset.id] = asset.uri;
            
            return ( assetsCache[asset.uri] = asset );
        },
        
        group: function( meta ){
            
            return lang.map( meta.deps, function( id ){
                return assets.make( id, meta );
            } );
        }
    };
    
    
    return assets;
    
} );
