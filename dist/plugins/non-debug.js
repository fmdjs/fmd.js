/**
 * @module fmd/preload
 * @author Edgar <mail@edgar.im>
 * @version v0.1
 * @date 131010
 * */


fmd( 'preload', ['global','lang','event','when','request','loader'],
    function( global, lang, event, when, request, loader ){
    'use strict';
    
    /**
     * Thanks to:
     * HeadJS, https://github.com/headjs/headjs/blob/master/src/load.js
     * YUI3, https://github.com/yui/yui3/blob/v3.13.0/src/get/js/get.js
     * lazyload, https://github.com/rgrove/lazyload/blob/master/lazyload.js
     * LABjs, https://github.com/getify/LABjs/blob/2.0/LAB.src.js
     * */
     
    var doc = global.document,
        isSupportAsync = 'async' in doc.createElement('script') || 'MozAppearance' in doc.documentElement.style || global.opera;
    
    var TYPE_CACHE = 'text/cache-javascript',
        STATE_PRELOADING = 'preloading',
        STATE_PRELOADED = 'preloaded';
    
    
    event.on( 'createNode', function( node, asset ){
        
        if ( asset.isPreload ){
            node.async = false;
            node.defer = false;
            
            !isSupportAsync && ( node.type = TYPE_CACHE );
        }
    } );
    
    event.on( 'request', function( asset, callback ){
        
        if ( asset.preState ){
            if ( asset.preState === STATE_PRELOADING ){
                asset.onpreload.push(function(){
                    loader( asset, callback );
                });
                
                delete asset.state;
                asset.requested = true;
            } else {
                delete asset.requested;
                delete asset.isPreload;
            }
        }
    } );
    
    
    var preRequest = function( asset ){
        
        if ( !asset.preState ){
            asset.preState = STATE_PRELOADING;
            asset.onpreload = [];
            
            request( asset, function(){
                
                asset.preState = STATE_PRELOADED;
                lang.forEach( asset.onpreload, function( call ){
                    call();
                } );
            } );
        }
    };
    
    
    var preloadByAsync = function( group, callback ){
        
        when.apply( null, lang.map( group, function( asset ){
            return function( promise ){
                asset.isPreload = true;
                loader( asset, function(){
                    promise.resolve();
                } );
            };
        } ) ).then( callback );
    },
    
    preloadByCache = function( group, callback ){
        
        var rest = group.slice( 1 );
        
        if ( rest.length ){
            lang.forEach( group, function( asset ){
                if ( !asset.isPreload ){
                    asset.isPreload = true;
                    preRequest( asset );
                }
            } );
            
            loader( group[0], function(){
                preload( rest, callback );
            } );
        } else {
            loader( group[0], callback );
        }
    },
    
    preload = function( group, callback ){
        
        preload = isSupportAsync ? preloadByAsync : preloadByCache;
        
        preload( group, callback );
    };
    
    
    return preload;
    
} );


/**
 * @module fmd/non
 * @author Edgar <mail@edgar.im>
 * @version v0.2
 * @date 131015
 * */


fmd( 'non', ['plugin','preload'],
    function( plugin, preload ){
    'use strict';
    
    plugin.register( 'non', function( callback ){
        
        preload( this.group, callback );
    } );
    
} );
