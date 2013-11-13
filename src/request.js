/**
 * @module fmd/request
 * @author Edgar <mail@edgar.im>
 * @version v0.2
 * @date 131007
 * */


fmd( 'request', ['global','config','event'],
    function( global, config, event ){
    'use strict';
    
    /**
     * Thanks to:
     * SeaJS, https://github.com/seajs/seajs/blob/master/src/util-request.js
     *        https://github.com/seajs/seajs/blob/master/tests/research/load-js-css/test.html
     *        https://github.com/seajs/seajs/blob/master/tests/research/load-js-css/load-css.html
     * YUI3, https://github.com/yui/yui3/blob/v3.13.0/src/get/js/get.js
     * HeadJS, https://github.com/headjs/headjs/blob/master/src/load.js
     * lazyload, https://github.com/rgrove/lazyload/blob/master/lazyload.js
     * RequireJS, https://github.com/jrburke/requirejs/blob/master/require.js
     * cujo.js, https://github.com/cujojs/curl/blob/master/src/curl.js
     * curl css! plugin, https://github.com/cujojs/curl/blob/master/src/curl/plugin/css.js
     * cssx, https://github.com/unscriptable/cssx/blob/master/src/cssx/css.js
     * LABjs, https://github.com/getify/LABjs/blob/2.0/LAB.src.js
     * */
    
    var doc = global.document,
        setTimeout = global.setTimeout;
    
    var rStyle = /\.css(?:\?|$)/i,
        rReadyStates = /loaded|complete/,
        rLoadXdSheetError = /security|denied/i;
        
    var isOldWebKit = ( global.navigator.userAgent.replace(/.*AppleWebKit\/(\d+)\..*/, "$1") ) * 1 < 536;
    
    var head = doc && ( doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement );
    
    
    var createNode = function( asset, isStyle ){
        
        var node;
        
        if ( isStyle ){
            node = doc.createElement('link');
            node.rel = 'stylesheet';
            node.href = asset.url;
        } else {
            node = doc.createElement('script');
            node.async = true;
            node.src = asset.url;
        }
        
        config.get('charset') && ( node.charset = config.get('charset') );
        
        event.emit( 'createNode', node, asset );
        
        return node;
    },
    
    poll = function( node, callback, asset ){
        
        var isLoaded = false,
            sheet, rules;
        
        try {
            sheet = node.sheet;
            
            if ( sheet ){
                rules = sheet.cssRules;
                isLoaded = rules ? rules.length > 0 : rules !== undefined;
            }
        } catch( ex ){
            isLoaded = rLoadXdSheetError.test( ex.message );
        }
        
        setTimeout( function(){
            if ( isLoaded ){
                callback && callback();
                event.emit( 'requested', asset );
            } else {
                poll( node, callback, asset );
            }
        }, 20 );
    };
    
    
    var onLoadAsset = function( node, callback, isSupportOnload, asset, isStyle ){
        
        if ( isSupportOnload ){
            node.onload = function(){
                finish();
                event.emit( 'requested', asset );
            };
            node.onerror = function(){
                finish();
                event.emit( 'requestError', asset );
            };
        } else {
            node.onreadystatechange = function(){
                if ( rReadyStates.test( node.readyState ) ){
                    finish();
                    event.emit( 'requested', asset );
                }
            };
        }
        
        function finish(){
            node.onload = node.onreadystatechange = node.onerror = null;
            
            if ( !isStyle && !config.get('debug') ){
                node.parentNode && node.parentNode.removeChild( node );
            }
            
            node = undefined;
            
            callback && callback();
        }
    },
    
    onLoadStyle = function( node, callback, isSupportOnload, asset ){
        
        if ( isOldWebKit || !isSupportOnload ){
            setTimeout( function(){
                poll( node, callback, asset );
            }, 1 );
            
            return;
        }
        
        onLoadAsset( node, callback, isSupportOnload, asset, true );
    },
    
    request = function( asset, callback ){
        
        var isStyle = rStyle.test( asset.url ),
            node = createNode( asset, isStyle ),
            isSupportOnload = 'onload' in node;
        
        isStyle ? onLoadStyle( node, callback, isSupportOnload, asset )
                : onLoadAsset( node, callback, isSupportOnload, asset );
        
        head.appendChild( node );
    };
    
    
    return request;
    
} );
