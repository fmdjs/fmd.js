/**
 * @module fmd/id2url
 * @author Edgar <mail@edgar.im>
 * @version v0.3
 * @date 170104
 * */


fmd( 'id2url', ['global','event','config'],
    function( global, event, config ){
    'use strict';
    
    var rAbsolute = /^https?:\/\//i;
    
    var TIME_STAMP = ( new Date() ).getTime();
    
    config.set({
        baseUrl: (function(){
            var rDomain = /^\w+\:\/\/[\w\-\.:]+\//i,
                scripts = global.document.getElementsByTagName('script'),
                selfScript = scripts[scripts.length-1],
                src = selfScript.hasAttribute ? selfScript.src : selfScript.getAttribute( 'src', 4 ),
                selfUrl = src ? src.match( rDomain ) : null;
            
            return selfUrl ? selfUrl[0] : '';
        })()
    });
    
    config.register({
        keys: 'stamp',
        name: 'object'
    });
    
    
    var addBaseUrl = function( asset ){
        
        rAbsolute.test( asset.url ) || ( asset.url = config.get('baseUrl') + asset.url );
    },
    
    addExtname = function( asset ){
        
        var url = asset.url;
        
        url.lastIndexOf('.') < url.lastIndexOf('/') && ( asset.url += '.js' );
    },
    
    addStamp = function( asset ){
            
        var t = config.get('hasStamp') ? TIME_STAMP : null,
            stampMap = config.get( 'stamp' );
            
        if ( stampMap ){
            for ( var key in stampMap ){
                if ( ( new RegExp( key ) ).test( asset.id ) ){
                    t = stampMap[key];
                    break;
                }
            }
        }
        
        t && ( asset.url += '?fmd.stamp=' + t );
    },
    
    id2url = function( asset ){
        
        event.emit( 'resolve', asset );
        asset.url = asset.uri;
        
        addBaseUrl( asset );
        addExtname( asset );
        
        event.emit( 'stamp', asset );
    };
    
    
    event.on( 'stamp', addStamp );
    event.on( 'id2url', id2url );

    event.on( 'id2uri', function( asset ){

        event.emit( 'id2url', asset );
        asset.uri = asset.url;
    } );
    
} );
