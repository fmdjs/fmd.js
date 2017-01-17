/**
 * @module fmd/relative
 * @author Edgar <mail@edgar.im>
 * @version v0.2
 * @date 170117
 * */


fmd( 'relative', ['lang','event'],
    function( lang, event ){
    'use strict';
    
    var rCwd = /.*\//,
        rDot = /\/\.\//,
        rDoubleDot = /[^\/]+\/\.\.\//;
    
    var relative = {
        cwd: function( id ){
            
            return id.match( rCwd )[0];
        },
        
        isDotStart: function( id ){

            return id.charAt(0) === '.';
        },
        
        hasSlash: function( id ){
            
            return id.lastIndexOf('/') > 0;
        },
        
        resolve: function( from, to ){
            
            var id = ( from + to ).replace( rDot, '/' );
            
            while ( id.match( rDoubleDot ) ){
                id = id.replace( rDoubleDot, '' );
            }
            
            return id;
        }
    };
    
    
    event.on( 'alias', function( meta, mod ){

        if ( mod && mod.id && relative.isDotStart( meta.id ) && relative.hasSlash( mod.id ) ){
            mod._cwd || ( mod._cwd = relative.cwd( mod.id ) );
            
            meta.id = relative.resolve( mod._cwd, meta.id );
        }
    } );
    
    
    return relative;
    
} );
