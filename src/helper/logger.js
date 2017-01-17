/**
 * @module fmd/logger
 * @author Edgar <mail@edgar.im>
 * @version v0.2
 * @date 170118
 * */


fmd( 'logger', ['global','require','env','config','assets','loader','console'],
    function( global, require, env, config, assets, loader, console ){
    'use strict';
    
    var noop = env.log = function(){},
        sysConsole = global.console;
    
    var createLogger = function( isDebug ){
        
        env.log = isDebug ? ( sysConsole && sysConsole.warn ? function( message, level ){
            sysConsole[ level || 'log' ]( message );
        } : function( message, level ){
            if ( console ){
                console( message, level );
            } else if ( loader ) {
                loader( assets.make('fmd/console'), function(){
                    console || ( console = require('console') );
                    console( message, level );
                } );
            }
        } ) : noop;
    };
    
    
    config.register({
        key: 'debug',
        rule: function( current, key, val ){
            createLogger( val );
            this.debug = val;
        }
    });
    
} );
