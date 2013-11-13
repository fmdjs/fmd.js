/**
 * @module fmd/id2url
 * @author Edgar <mail@edgar.im>
 * @version v0.2
 * @date 131015
 * */


fmd( 'id2url', ['global','event','config'],
    function( global, event, config ){
    'use strict';
    
    var rAbsolute = /^https?:\/\//i;
    
    var TIME_STAMP = ( new Date() ).getTime(),
        RESOLVE = 'resolve',
        STAMP = 'stamp';
    
    
    config.set({
        baseUrl: (function(){
            var rUrl = /(?:[\w]+)\:\/\/(?:[\w|\.|\:]+)\//i,
                scripts = global.document.getElementsByTagName('script'),
                selfScript = scripts[scripts.length-1],
                selfUrl = ( selfScript.hasAttribute ? selfScript.src : selfScript.getAttribute("src", 4) ).match( rUrl );
            
            return selfUrl[0];
        })()
    });
    
    config.register({
        keys: RESOLVE,
        name: 'array'
    })
    .register({
        keys: STAMP,
        name: 'object'
    });
    
    
    var parseResolve = function( asset ){
            
        var resolve = config.get(RESOLVE),
            url;
        
        if ( resolve ){
            for ( var i = 0, l = resolve.length; i < l; i++ ){
                url = resolve[i]( asset.id );
                
                if ( url !== asset.id ){
                    break;
                }
            }
        }
        
        asset.url = url ? url : asset.id;
    },
    
    addBaseUrl = function( asset ){
        
        rAbsolute.test( asset.url ) || ( asset.url = config.get('baseUrl') + asset.url );
    },
    
    addSuffix = function( asset ){
        
        var url = asset.url;
        
        url.lastIndexOf('.') < url.lastIndexOf('/') && ( asset.url += '.js' );
    },
    
    addStamp = function( asset ){
            
        var t = config.get('hasStamp') ? TIME_STAMP : null,
            stamp = config.get(STAMP);
            
        if ( stamp ){
            for ( var key in stamp ){
                if ( ( new RegExp( key ) ).test( asset.id ) ){
                    t = stamp[key];
                    break;
                }
            }
        }
        
        t && ( asset.url += '?fmd.stamp=' + t );
    },
    
    id2url = function( asset ){
        
        event.emit( 'alias', asset );
        event.emit( RESOLVE, asset );
        
        addBaseUrl( asset );
        addSuffix( asset );
        
        event.emit( STAMP, asset );
    };
    
    
    event.on( RESOLVE, parseResolve );
    event.on( STAMP, addStamp );
    event.on( 'id2url', id2url );
    
} );
